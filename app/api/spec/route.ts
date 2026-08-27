import OpenAI from "openai";
import crypto from "node:crypto";

import {
  visualSpecSchema,
  type VisualSpec,
} from "@/lib/visual-spec";

import { saveVisualSpec } from "@/lib/neo4j";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "image is required" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");

    const imageUrl =
      `data:${file.type || "image/jpeg"};base64,${base64}`;

    const response = await openai.responses.create({
      model: "gpt-5.4",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are the visual interpreter for RED PEN.

RED PEN turns rough human imagination into executable software.

The provided image is a hand-drawn concept.

It may represent:
- an interactive artwork
- a game
- an animation
- an interface
- a visualization
- a digital toy
- an unconventional software experience

Do NOT assume it is a normal website.

The drawing is the source of truth.

Extract:

1. Every meaningful visual object
2. Approximate position using normalized values from 0 to 1
3. Approximate size using normalized values from 0 to 1
4. Spatial relationships
5. Arrows and connections
6. Handwritten annotations
7. Intended interactions
8. Intended motion
9. Visual style and mood

IMPORTANT:

Do not redesign the drawing.
Do not normalize unusual composition.
Do not turn it into a generic AI-generated UI.
Preserve asymmetry, strange proportions, and human taste.

For relations:
"from" and "to" must reference IDs in the objects array.

For interactions:
If something refers to the mouse, keyboard, screen, user, or another
non-visual actor, use a descriptive string such as "mouse" or "user".

Your task is to understand the creator's imagination,
not improve it.
              `,
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high",
            },
          ],
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name: "red_pen_visual_spec",
          strict: true,
          schema: visualSpecSchema,
        },
      },
    });

    const spec = JSON.parse(
      response.output_text
    ) as VisualSpec;

    const sketchId = crypto.randomUUID();

    await saveVisualSpec(sketchId, spec);

    return Response.json({
      sketchId,
      spec,
    });
  } catch (error) {
    console.error("RED PEN ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

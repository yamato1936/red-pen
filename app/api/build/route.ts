import OpenAI from "openai";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { spec } = await req.json();

    if (!spec) {
      return Response.json(
        { error: "spec is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.4",
      input: `
You are implementing a RED PEN sketch as interactive software.

VisualSpec:
${JSON.stringify(spec)}

Create a single self-contained HTML file.

Rules:
- HTML/CSS/JavaScript only
- no external dependencies
- render scene objects, not annotations/arrows
- treat annotations as instructions
- use interactions as behavioral truth
- preserve the human, sketch-like aesthetic
- do not create a generic SaaS UI
- make it immediately interactive

For this sketch:
- ball falls slowly toward water
- when ball reaches water, expanding ripples appear
- character follows mouse

Return ONLY the complete HTML source.
`,
    });

    const html = response.output_text;

    const outputPath = path.join(
      process.cwd(),
      "public",
      "generated.html"
    );

    await fs.writeFile(outputPath, html, "utf8");

    return Response.json({
      ok: true,
      url: "/generated.html",
    });
  } catch (error) {
    console.error("BUILD ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Build failed",
      },
      { status: 500 }
    );
  }
}
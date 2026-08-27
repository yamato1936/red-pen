import neo4j from "neo4j-driver";
import type { VisualSpec } from "./visual-spec";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME!,
    process.env.NEO4J_PASSWORD!
  )
);

export async function saveVisualSpec(
  sketchId: string,
  spec: VisualSpec
) {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE ?? "neo4j",
  });

  try {
    await session.executeWrite(async (tx) => {
      await tx.run(
        `
        CREATE (s:Sketch {
          id: $id,
          title: $title,
          summary: $summary,
          mood: $mood
        })
        `,
        {
          id: sketchId,
          title: spec.title,
          summary: spec.summary,
          mood: spec.style.mood,
        }
      );

      for (const object of spec.objects) {
        await tx.run(
          `
          MATCH (s:Sketch {id: $sketchId})

          CREATE (o:VisualObject {
            sketchId: $sketchId,
            id: $id,
            type: $type,
            label: $label,
            description: $description,
            x: $x,
            y: $y,
            width: $width,
            height: $height,
            styleHints: $styleHints
          })

          CREATE (s)-[:CONTAINS]->(o)
          `,
          {
            sketchId,
            ...object,
          }
        );
      }

      for (const relation of spec.relations) {
        await tx.run(
          `
          MATCH
            (a:VisualObject {
              sketchId: $sketchId,
              id: $from
            }),
            (b:VisualObject {
              sketchId: $sketchId,
              id: $to
            })

          CREATE (a)-[:RELATES_TO {
            kind: $type,
            description: $description
          }]->(b)
          `,
          {
            sketchId,
            ...relation,
          }
        );
      }
    });
  } finally {
    await session.close();
  }
}
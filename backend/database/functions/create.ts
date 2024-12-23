import { Session } from "https://deno.land/x/neo4j_driver_lite@5.14.0/mod.ts";

export async function createNode(
  session: Session,
  label: string,
  properties: Record<string, any>,
): Promise<void> {
  const keys = Object.keys(properties);
  const query = `
        CREATE (n:${label} {${keys.map((k) => `${k}: $${k}`).join(", ")}})
        RETURN n
    `;
  try {
    await session.run(query, properties);
  } catch (error) {
    console.error("Erreur lors de la création du noeud : ", error);
  }
}

export async function createRelationship(
  session: Session,
  fromId: string,
  fromLabel: string,
  toId: string,
  toLabel: string,
  relationshipType: string,
): Promise<void> {
  const query = `
        MATCH (a:${fromLabel} {ID: $fromId}), (b:${toLabel} {ID: $toId})
        CREATE (a)-[:${relationshipType}]->(b)
    `;
  try {
    await session.run(query, { fromId, toId });
  } catch (error) {
    console.error("Erreur lors de la création de la relation : ", error);
  }
}

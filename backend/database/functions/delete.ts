import { Session } from "https://deno.land/x/neo4j_driver_lite@5.14.0/mod.ts";

export async function deleteAllNodes(session: Session) {
  const query = `
        MATCH (n)
        DETACH DELETE n
        `;
  await session.run(query);
  console.log("Toutes les données ont été supprimées.");
}

export async function deleteNodeById(nodeId: string, session: Session) {
  const query = `
            MATCH (n {ID: $nodeId})
            DETACH DELETE n
        `;
  await session.run(query, { nodeId });
  console.log(`Le noeud avec ID ${nodeId} a été supprimé.`);
}

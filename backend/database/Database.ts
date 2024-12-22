import neo4j, { Session, Driver } from "https://deno.land/x/neo4j_driver_lite@5.14.0/mod.ts";

export function connectToDatabase(url: string, username: string, password: string) {
  const driver = neo4j.driver(url, neo4j.auth.basic(username, password));
  const session = driver.session();
  return { driver, session };
}

export async function closeConnection(driver : Driver, session  : Session) {
  await session.close();
  await driver.close();
}

export async function createNode(session: Session, label: string, properties: Record<string, any>): Promise<void> {
  const keys = Object.keys(properties);
  const query = `
    CREATE (n:${label} {${keys.map(k => `${k}: $${k}`).join(", ")}})
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
  relationshipType: string
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

export async function deleteAllNodes(session : Session) {
    const query = `
      MATCH (n)
      DETACH DELETE n
    `;
    await session.run(query);
    console.log("Toutes les données ont été supprimées.");
  }

    export async function deleteNodeById(nodeId: string , session: Session) {
      const query = `
        MATCH (n {ID: $nodeId})
        DETACH DELETE n
      `;
      await session.run(query, { nodeId });
      console.log(`Le noeud avec ID ${nodeId} a été supprimé.`);
    }

    export async function getAllNodes(session: Session){
      const query = `Match (n)
      Return n` ; 
      const result  = await session.run(query) ; 
      return result.records.map(record => record.get("n").properties);
    }

    export async function getNodeById(NodeID: string , session: Session){
      const query = `MATCH (n {ID : $NodeID})
      Return n`
      const result = await session.run(query, { NodeID }) ; 
      return result.records.length > 0 ? result.records[0].get("n").properties : null;
    }

    export async function getNodeByLabel(Label : string ,session: Session){
      const query = `MATCH (n:${Label})
      return n` ; 
      const result =await session.run(query)
      return result.records.map(record => record.get("n").properties);
    }

    export async function deleteRelationshipById(ID : string , session: Session){
      const query= `Match ()-[n{ID:$ID}]->()
      delete n ` ; 
      await session.run(query, { ID }) ; 
      console.log(`La relation avec l'id ${ID} a été supprimé`)
    }

    export async function getNodeByFirstLetterWithLabelSpecified(Label : string , Letter : string , session : Session){
      const query = `MATCH (n:${Label})
      where n.Name starts with $Letter
      return n` ;
      const result  = await session.run(query , { Letter }) ; 
      return result.records.map(record => record.get("n").properties);
    }

    export async function getNodeByFirstLetterWithLabelNotSpecified(Letter : string , session : Session){
      const query = `MATCH (n)
      Where n.Name starts with $Letter
      return n` ; 
      const result = await session.run(query , { Letter }) ; 
      return result.records.map(record => record.get("n").properties) ;
    }
import { Session } from "@neo4j_driver_lite";

export async function getAllNodes(session: Session) {
  const query = `Match (n)
            Return n`;
  const result = await session.run(query);
  return result.records.map((record) => record.get("n").properties);
}

export async function getNodeById(NodeID: string, session: Session) {
  const query = `MATCH (n {ID : $NodeID})
            Return n`;
  const result = await session.run(query, { NodeID });
  return result.records.length > 0
    ? result.records[0].get("n").properties
    : null;
}

export async function getNodeByLabel(Label: string, session: Session) {
  const query = `MATCH (n:${Label})
            return n`;
  const result = await session.run(query);
  return result.records.map((record) => record.get("n").properties);
}

export async function deleteRelationshipById(ID: string, session: Session) {
  const query = `Match ()-[n{ID:$ID}]->()
            delete n `;
  await session.run(query, { ID });
  console.log(`La relation avec l'id ${ID} a été supprimé`);
}

export async function getNodesByNameFragmentWithLabel(
  label: string,
  fragment: string,
  session: Session,
) {
  const query = `
                MATCH (n:${label})
                WHERE toLower(n.Name) CONTAINS toLower($fragment)
                RETURN n
                `;
  const result = await session.run(query, { fragment });
  return result.records.map((record) => record.get("n").properties);
}

export async function getNodesByNameFragmentWithoutLabel(
  fragment: string,
  session: Session,
) {
  const query = `
            MATCH (n)
            WHERE toLower(n.Name) CONTAINS toLower($fragment)
            RETURN n
            `;
  const result = await session.run(query, { fragment });
  return result.records.map((record) => record.get("n").properties);
}

export async function getPlacesByThemeNameFragment(
    fragment: string,
    session: Session,
  ) {
    const query = `
      MATCH (place: Place)-[:HAS_THEME]->(t:Theme)
      WHERE toLower(t.Name) CONTAINS toLower($fragment)
      RETURN DISTINCT place
    `;
    const result = await session.run(query, { fragment });
    return result.records.map((record) => record.get("place").properties);
  }
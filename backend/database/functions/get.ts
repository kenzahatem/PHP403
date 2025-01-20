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


export async function getNodesByNameFragmentWithoutLabel(
  fragment: string,
  session: Session,
) {
  const startsQuery = `
    MATCH (n)
    WHERE toLower(n.label) STARTS WITH toLower($fragment)
    AND NOT "Theme" IN labels(n)  
    RETURN n
  `;

  const containsQuery = `
    MATCH (n)
    WHERE toLower(n.label) CONTAINS toLower($fragment)
    AND NOT toLower(n.label) STARTS WITH toLower($fragment)
    AND NOT "Theme" IN labels(n)  
    RETURN n
  `;
  const relatedPlacesQuery = `
  MATCH (place:Place)-[:HAS_THEME]->(theme:Theme)
  WHERE toLower(theme.label) CONTAINS toLower($fragment)
  RETURN place
`;

const startsResult = await session.run(startsQuery, { fragment });
const startsRecords = startsResult.records.map((record) => record.get("n").properties);

const containsResult = await session.run(containsQuery, { fragment });
const containsRecords = containsResult.records.map((record) => record.get("n").properties);

const relatedPlacesResult = await session.run(relatedPlacesQuery, { fragment });
const relatedPlacesRecords = relatedPlacesResult.records.map((record) => record.get("place").properties);

return [...startsRecords, ...relatedPlacesRecords, ...containsRecords];
}


export async function getPlacesByThemeNameFragment(
    fragment: string,
    session: Session,
  ) {
    const query = `
      MATCH (place: Place)-[:HAS_THEME]->(t:Theme)
      WHERE toLower(t.label) CONTAINS toLower($fragment)
      RETURN DISTINCT place
    `;
    const result = await session.run(query, { fragment });
    return result.records.map((record) => record.get("place").properties);
  }

  export async function getCountriesByContinentNameFragment(
    fragment: string,
    session: Session,
  ) {
    const query = `
      MATCH (continent:Continent)-[:HAS_COUNTRY]->(country:Country)
      WHERE toLower(continent.label) CONTAINS toLower($fragment)
      RETURN DISTINCT country
    `;
    const result = await session.run(query, { fragment });
    return result.records.map((record) => record.get("country").properties);
  }

  export async function getCitiesByCountryNameFragment(
    fragment: string,
    session: Session,
  ) {
    const query = `
      MATCH (country:Country)-[:HAS_CITY]->(city:City)
      WHERE toLower(country.label) CONTAINS toLower($fragment)
      RETURN DISTINCT city
    `;
    const result = await session.run(query, { fragment });
    return result.records.map((record) => record.get("city").properties);
  }

  export async function getPlacesByCityNameFragment(
    fragment: string,
    session: Session,
  ) {
    const query = `
      MATCH (city:City)-[:HAS_PLACE]->(place:Place)
      WHERE toLower(city.label) CONTAINS toLower($fragment)
      RETURN DISTINCT place
    `;
    const result = await session.run(query, { fragment });
    return result.records.map((record) => record.get("place").properties);
  }

  export async function getNodesRelatedToSpecifiedNode(
    id : string,
    session : Session,
  ){
    const query =`
      MATCH (startNode {id: $id})-[]->(relatedNode)
      RETURN relatedNode
      ` ; 
    const result = await session.run(query, {id}) ; 
    return result.records.map((record) => record.get("relatedNode").properties);
  }


  //unused 
  // export async function getNodesByNameFragmentWithLabel(
  //   label: string,
  //   fragment: string,
  //   session: Session,
  // ) {
  //   const query = `
  //                 MATCH (n:${label})
  //                 WHERE toLower(n.label) CONTAINS toLower($fragment)
  //                 RETURN n
  //                 `;
  //   const result = await session.run(query, { fragment });
  //   return result.records.map((record) => record.get("n").properties);
  // }
  
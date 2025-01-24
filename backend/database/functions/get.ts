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
  limit: number,
  skip: number,
  session: Session
) {
  limit = Math.floor(limit);  
  skip = Math.floor(skip);

  const startsQuery = `
    MATCH (n)
    WHERE toLower(n.label) STARTS WITH toLower($fragment)
      AND NOT "Theme" IN labels(n)
      AND NOT n.label =~ 'Q[0-9]+'  
    RETURN n
    SKIP toInteger($skip) LIMIT toInteger($limit)
  `;

  const containsQuery = `
    MATCH (n)
    WHERE toLower(n.label) CONTAINS toLower($fragment)
      AND NOT toLower(n.label) STARTS WITH toLower($fragment)
      AND NOT "Theme" IN labels(n)
      AND NOT n.label =~ 'Q[0-9]+'  
    RETURN n 
    SKIP toInteger($skip) LIMIT toInteger($limit)
  `;

  const relatedPlacesQuery = `
    MATCH (place:Place)-[:HAS_THEME]->(theme:Theme)
    WHERE toLower(theme.label) CONTAINS toLower($fragment)
      AND NOT place.label =~ 'Q[0-9]+'  
    RETURN place
    SKIP toInteger($skip) LIMIT toInteger($limit)
  `;

  const startsResult = await session.run(startsQuery, { fragment, skip, limit });
  const startsRecords = startsResult.records.map((record) => record.get("n").properties);

  const containsResult = await session.run(containsQuery, { fragment, skip, limit });
  const containsRecords = containsResult.records.map((record) => record.get("n").properties);

  const relatedPlacesResult = await session.run(relatedPlacesQuery, { fragment, skip, limit });
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
      WHERE NOT "Theme" IN labels(relatedNode) 
      AND NOT relatedNode.label =~ 'Q[0-9]+' 
      RETURN relatedNode LIMIT 100 ; 
      ` ; 
    const result = await session.run(query, {id}) ; 
    return result.records.map((record) => record.get("relatedNode").properties);
  }

  export async function getPrincipleThemes(
    session : Session)
    {
    const query = `
    MATCH (theme:Theme)
    WHERE NOT (theme)-[:IS_SUBCLASS_OF]->(:Theme)  
    RETURN theme
    ORDER BY theme.label ASC
    ` ;
    const result = await session.run(query);
    return result.records.map((record) => record.get("theme").properties);
  }

  export async function getPlacesRelatedToTheme(
    themeId : string,
    session : Session,
  ){
    const query =`
      MATCH (p:Place)-[:HAS_THEME]->(t:Theme) 
      WHERE t.id = $themeId 
      AND NOT p.label =~ 'Q[0-9]+'
      RETURN p LIMIT 59; 
      ` ; 
    const result = await session.run(query, {themeId}) ; 
    return result.records.map((record) => record.get("p").properties);
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
  
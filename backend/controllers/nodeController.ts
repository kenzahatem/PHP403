import { runWithSession } from "../database/utils.ts";
import {
  getAllNodes,
  getPlacesByThemeNameFragment,
  getNodeById,
  getNodesByNameFragmentWithoutLabel,
  getCitiesByCountryNameFragment , 
  getCountriesByContinentNameFragment , 
  getNodeByLabel , 
  getPlacesByCityNameFragment, 
  getNodesRelatedToSpecifiedNode,
  getPrincipleThemes
} from "../database/functions/get.ts";


export const fetchAllNodes = async () => {
  return await runWithSession(getAllNodes);
};

export const fetchNodeById = async (id: string) => {
  return await runWithSession(getNodeById, id);
};

export const fetchNodesByNameFragmentWithoutLabel = async (
  fragment: string, limit: number , skip : number
) => {
  console.log("Appel à fetchNodesByNameFragmentWithoutLabel avec:", fragment, limit, skip);
  return await runWithSession(getNodesByNameFragmentWithoutLabel, fragment, limit, skip);
};


export const fetchPlacesByThemeNameFragment = async (fragment: string) => {
  return await runWithSession(getPlacesByThemeNameFragment, fragment);
}

//récuperre les thèmes prinicpales 
export const fetchPrincipleThemes = async () => {
  return await runWithSession(getPrincipleThemes) ; 
}


// Contrôleur pour récupérer des pays par fragment de nom de continent
export const fetchCountriesByContinentNameFragment = async (fragment : string ) => {
  return await runWithSession(getCountriesByContinentNameFragment, fragment);
};

// Contrôleur pour récupérer des villes par fragment de nom de pays
export const fetchCitiesByCountryNameFragment = async (fragment : string ) => {
  return await runWithSession(getCitiesByCountryNameFragment, fragment);
};

// Contrôleur pour récupérer des lieux par fragment de nom de ville
export const fetchPlacesByCityNameFragment = async (fragment : string ) => {
  return await runWithSession(getPlacesByCityNameFragment, fragment);
};

export const fetchNodesByLabel = async (label : string ) => {
  return await runWithSession(getNodeByLabel, label);
};

//récuperer les noeud qui sont reliés a un node spécifié (vers qu'un seul sens)
export const fetchNodesRelatedToSpecifiedNode = async (id : string) => {
  return await runWithSession(getNodesRelatedToSpecifiedNode,id) ; 
} ; 

export const fetchMetricsWithPagination = async (startDate: string, endDate: string) => {
  const start = `${startDate}T00:00:00`;
  const end = `${endDate}T23:59:59`;

  const query = `
    MATCH (m:Metric {type: "response_time"})
    WHERE datetime(m.timestamp) >= datetime($start)
      AND datetime(m.timestamp) <= datetime($end)
    RETURN m.endpoint AS endpoint, m.responseTime AS responseTime, m.numItems AS numItems, m.timestamp AS timestamp
    ORDER BY m.timestamp ASC
  `;
  return await runWithSession(async (session) => {
    const result = await session.run(query, { start, end });
    return result.records.map((record: { get: (arg0: string) => any; }) => ({
      endpoint: record.get("endpoint"),
      responseTime: record.get("responseTime"),
      numItems: record.get("numItems"),
      timestamp: record.get("timestamp"),
    }));
  });
};



//Unused functions 

// export const searchFromQuery = async (query: string) => {
//   // Places whose name contains the query
//   const placesByName = await runWithSession(getNodesByNameFragmentWithLabel, "Place", query);

//   // Places linked to a theme whose name contains the query
//   const placesByTheme = await runWithSession(getPlacesByThemeNameFragment, query);

//   const combined_and_unique = removeDuplicatesByID([...placesByName, ...placesByTheme]);

//   return combined_and_unique;
// };

// export const fetchNodesByNameFragmentWithLabel = async (
//   label: string,
//   fragment: string,
// ) => {
//   const nodes =await runWithSession(getNodesByNameFragmentWithLabel, label, fragment);
//   const uniqueNodes = removeDuplicatesByKey(nodes , "Name") ; 
//   return uniqueNodes ; 
// };

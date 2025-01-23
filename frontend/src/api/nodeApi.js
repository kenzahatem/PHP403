const BASE_URL  = "http://localhost:8000" ; 
export async function fetchAllNodes() {
    const response = await fetch(`${BASE_URL}/nodes`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des nœuds.");
    }
    const data = await response.json();
    return data ; 
  }

export async function searchFromQuery(query){
  const response = await fetch(`${BASE_URL}/search/places/${query}`) ; 
  if (! response.ok){
    console.warn(`Aucun résultat trouvé pour : "${query}"`);
    return []; 
  }
  const data = await response.json() ; 
  return data  ; 
}

export async function fetchNodesByNameFragmentWithoutLabel(query, skip = 0, limit = 20) {
  const url = `${BASE_URL}/nodes/search/by-name?query=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Aucun résultat trouvé pour : "${query}"`);
      return [];
    }
    const data = await response.json();
    if (data.length === 0) {
      console.warn(`Aucun noeud trouvé pour : "${query}"`);
    }
    return data; 
  } catch (error) {
    console.error(`Erreur lors de la récupération des noeuds : ${error.message}`);
    return [];
  }
}

export async function fetchprincipleThemesApi() {
  const response = await fetch(`${BASE_URL}/principle-nodes`) ; 
  if(!response.ok){
    console.warn(`Aucun résultat trouvé`);
    return [];
  }
  const data = await response.json() ; 
  return data ; 
}


export async function fetchThemes(query){
  const response = await fetch(`${BASE_URL}/nodes/label/Theme`) ; 
  if(!response.ok){
    console.warn(`Aucun résultat trouvé pour : "${query}"`);
    return [];
  }
  const data = await response.json() ; 
  return data ; 
}


export async function fetchNodesWithRelationship(query) {
  let response;
  console.log(query) ; 

  try {
    response = await fetch(`${BASE_URL}/relatednodes/${query.id}`);
    if (!response.ok) {
      console.warn(`Aucun résultat trouvé pour : "${query.fragment}"`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des nœuds :", error);
    return [];
  }
}

export async function fetchMetrics({ startDate, endDate }) {
  const response = await fetch(
    `${BASE_URL}/metrics?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }
  const data = await response.json();
  return data;
}

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

export async function fetchNodesByNameFragmentWithoutLabel(query){
  const response = await fetch(`${BASE_URL}/nodes/search/${query}`) ; 
  if(!response.ok){
    console.warn(`Aucun résultat trouvé pour : "${query}"`);
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
  // console.log(query.ID.startsWith("country")) ; 

  try {
    if (query.ID.startsWith("continent")) {
      response = await fetch(`${BASE_URL}/search/countries/continent/${query.Name}`);
    } else if (query.ID.startsWith("country")) {
      response = await fetch(`${BASE_URL}/search/cities/country/${query.Name}`);
    } else if (query.ID.startsWith("city")) {
      response = await fetch(`${BASE_URL}/search/places/city/${query.Name}`);
    } else if (query.ID.startsWith("theme")) {
      response = await fetch(`${BASE_URL}/search/places/theme/${query.Name}`);
    } else {
      console.warn(`Type non reconnu : "${query.contains}"`);
      return [];
    }

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
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
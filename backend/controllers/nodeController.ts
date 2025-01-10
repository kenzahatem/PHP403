import { runWithSession } from "../database/utils.ts";
import {
  getAllNodes,
  getPlacesByThemeNameFragment,
  getNodeById,
  getNodesByNameFragmentWithLabel,
  getNodesByNameFragmentWithoutLabel,
  getCitiesByCountryNameFragment , 
  getCountriesByContinentNameFragment , 
  getNodeByLabel , 
  getPlacesByCityNameFragment
} from "../database/functions/get.ts";
import { removeDuplicatesByID } from "./helper.ts";


export const fetchAllNodes = async () => {
  return await runWithSession(getAllNodes);
};

export const fetchNodeById = async (id: string) => {
  return await runWithSession(getNodeById, id);
};

export const fetchNodesByNameFragmentWithoutLabel = async (
  fragment: string,
) => {
  return await runWithSession(getNodesByNameFragmentWithoutLabel, fragment);
};

export const fetchNodesByNameFragmentWithLabel = async (
  label: string,
  fragment: string,
) => {
  return await runWithSession(getNodesByNameFragmentWithLabel, label, fragment);
};

export const fetchPlacesByThemeNameFragment = async (fragment: string) => {
  return await runWithSession(getPlacesByThemeNameFragment, fragment);
}

export const searchFromQuery = async (query: string) => {
  // Places whose name contains the query
  const placesByName = await runWithSession(getNodesByNameFragmentWithLabel, "Place", query);

  // Places linked to a theme whose name contains the query
  const placesByTheme = await runWithSession(getPlacesByThemeNameFragment, query);

  const combined_and_unique = removeDuplicatesByID([...placesByName, ...placesByTheme]);

  return combined_and_unique;
};

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

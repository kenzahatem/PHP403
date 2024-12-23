import { runWithSession } from "../database/utils.ts";
import {
  getAllNodes,
  getPlacesByThemeNameFragment,
  getNodeById,
  getNodesByNameFragmentWithLabel,
  getNodesByNameFragmentWithoutLabel,
} from "../database/functions/get.ts";


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


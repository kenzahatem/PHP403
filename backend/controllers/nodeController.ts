import { runWithSession } from "../database/utils.ts";
import {
  getAllNodes,
  getNodeById,
} from "../database/functions/get.ts";


export const fetchAllNodes = async () => {
  return await runWithSession(getAllNodes);
};

export const fetchNodeById = async (id: string) => {
  return await runWithSession(getNodeById, id);
};

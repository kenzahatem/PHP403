import { connectToDatabase, closeConnection, getAllNodes, getNodeById } from "../database/Database.ts";
import { config } from "../database/config.ts";



// Récupérer tous les noeuds
export const fetchAllNodes = async () => {
  const { driver, session } = connectToDatabase(config.url, config.username, config.password);
  try {
    return await getAllNodes(session);
  } finally {
    await closeConnection(driver, session);
  }
};

// Récupérer un noeud par son ID
export const fetchNodeById = async (id: string) => {
    const { driver, session } = connectToDatabase(config.url, config.username, config.password);
  try {
    return await getNodeById(id, session);
  } finally {
    await closeConnection(driver, session);
  }
};

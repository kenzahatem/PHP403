import {connectToDatabase,closeConnection,} from "./Database.ts";
import {deleteAllNodes} from "./functions/delete.ts";
import { config } from "./config.ts";
async function main() {
  const { driver, session } = connectToDatabase(config.url, config.username, config.password);

  try {
    await deleteAllNodes(session) ; 
} catch (error) {
    console.error("Erreur :", error);
  } finally {
    // Fermer la connexion
    await closeConnection(driver, session);
    console.log("Connexion fermée :)")
  }
}

main().catch(console.error);

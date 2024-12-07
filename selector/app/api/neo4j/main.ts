
import { readJsonTyped } from "./utils.ts";
import { Continent, Country, City, Place, Theme, Relationship } from "./types.ts";
import { config } from "./config.ts";
import {connectToDatabase,closeConnection,createNode,createRelationship,} from "./Database.ts";


//le script sert a créer un test d'une db avec des données qui ne sont pas forcèment réels

async function main() {
  const { driver, session } = connectToDatabase(config.url, config.username, config.password);

  try {

    const continents: Continent[] = await readJsonTyped<Continent[]>('./seed/continentsSeed.json');
    const countries: Country[] = await readJsonTyped<Country[]>('./seed/countriesSeed.json');
    const cities: City[] = await readJsonTyped<City[]>('./seed/citiesSeed.json');
    const places: Place[] = await readJsonTyped<Place[]>('./seed/placesSeed.json');
    const themes: Theme[] = await readJsonTyped<Theme[]>('./seed/themesSeed.json');
    const relationships: Relationship[] = await readJsonTyped<Relationship[]>('./seed/Relationships.json');



    for (const continent of continents) {
      await createNode(session, 'Continent', continent);
    }
    for (const country of countries) {
      await createNode(session, 'Country', country);
    }
    for (const city of cities) {
      await createNode(session, 'City', city);
    }
    for (const place of places) {
      await createNode(session, 'Place', place);
    }
    for (const theme of themes) {
      await createNode(session, 'Theme', theme);
    }


    for (const relation of relationships) {
      await createRelationship(session, relation.fromID, relation.from, relation.toID, relation.to, relation.type);
    }
    console.log("Tous s'est bien passé normalement :)")

  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    // Fermer la connexion
    await closeConnection(driver, session);
    console.log("Connexion fermée :)")
  }
}

main().catch(console.error);

//  pour lancer ce script sur deno : deno run --allow-net --allow-read --allow-sys main.ts
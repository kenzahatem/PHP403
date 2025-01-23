import { readJsonTyped } from "./utils.ts";
import {connectToDatabase,closeConnection,} from "./Database.ts";
import { Continent, Country, City, Place, Theme } from "./types.ts";
import { config } from "./config.ts";
import {createNode} from "./functions/create.ts";

async function main() {
  const { driver, session } = connectToDatabase(config.url, config.username, config.password);

  try {

    const continents: Continent[] = await readJsonTyped<Continent[]>('data_gathering/results/continents.json');
    const countries: Country[] = await readJsonTyped<Country[]>('data_gathering/results/pays.json');
    const cities: City[] = await readJsonTyped<City[]>('data_gathering/results/cities.json');
    const places: Place[] = await readJsonTyped<Place[]>('data_gathering/results/places.json');
    const themes: Theme[] = await readJsonTyped<Theme[]>('data_gathering/results/themes.json');
    // const relationships: Relationship[] = await readJsonTyped<Relationship[]>('./seeder/Relationships.json');


    let successCount = 0;
    for (const continent of continents) {
        // console.log(continent) ; 
      await createNode('Continent', continent, session);
      successCount++;
    }
    for (const country of countries) {
      await createNode('Country', country, session);
    }
    for (const city of cities) {
      await createNode('City', city, session);
    }
    for (const place of places) {
      await createNode('Place', place, session);
    }
    for (const theme of themes) {
      await createNode('Theme', theme, session);
    }


    // for (const relation of relationships) {
    //   await createRelationship(session, relation.fromID, relation.from, relation.toID, relation.to, relation.type);
    // }
    console.log("Tous s'est bien passé normalement :)")
    console.log(`${successCount}/${continents.length} nœuds créés avec succès.`);

  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    // Fermer la connexion
    await closeConnection(driver, session);
    console.log("Connexion fermée :)")
  }
}

main().catch(console.error);
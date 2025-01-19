import { connectToDatabase, closeConnection } from "./Database.ts";
import {
  createContinentToCountryRelationship,
  createCountryToCityRelationship,
  createCityToPlaceRelationship,
  createPlaceToThemeRelationship,
  createThemeHierarchyRelationship,
} from "./functions/create.ts";
import { config } from "./config.ts";
import { readJsonTyped } from "./utils.ts";
import { City, Country, Place, Theme } from "./types.ts";

async function main() {
  const { driver, session } = connectToDatabase(config.url, config.username, config.password);

  try {
    // const continents: Continent[] = await readJsonTyped<Continent[]>('data_gathering/results/continents.json');
    const countries: Country[] = await readJsonTyped<Country[]>('data_gathering/results/pays.json');
    const cities: City[] = await readJsonTyped<City[]>('data_gathering/results/cities.json');
    const places: Place[] = await readJsonTyped<Place[]>('data_gathering/results/places.json');
    const themes: Theme[] = await readJsonTyped<Theme[]>('data_gathering/results/themes.json');

    // Créer les relations Continent → Country
    for (const country of countries) {
      await createContinentToCountryRelationship(session, country.continent, country.id);
    }

    // Créer les relations Country → City
    for (const city of cities) {
      await createCountryToCityRelationship(session, city.country, city.id);
    }

    // Créer les relations City → Place
    for (const place of places) {
      await createCityToPlaceRelationship(session, place.city, place.id);
    }

    // Créer les relations Place → Theme
    for (const place of places) {
      for (const themeId of place.themes || []) {
        await createPlaceToThemeRelationship(session, place.id, themeId);
      }
    }

    // Créer les relations entre les thèmes (Theme → Theme)
    for (const theme of themes) {
      for (const superclassId of theme.superclasses || []) {
        await createThemeHierarchyRelationship(session, theme.id, superclassId);
      }
    }

    console.log("Toutes les relations ont été créées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la création des relations :", error);
  } finally {
    await closeConnection(driver, session);
    console.log("Connexion fermée :)")
  }
}

main().catch(console.error);

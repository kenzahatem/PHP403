import { Session } from "@neo4j_driver_lite";

export async function createNode(
  session: Session,
  label: string,
  properties: Record<string, any>,
): Promise<void> {
  const keys = Object.keys(properties);
  const query = `
        CREATE (n:${label} {${keys.map((k) => `${k}: $${k}`).join(", ")}})
        RETURN n
    `;
  try {
    await session.run(query, properties);
  } catch (error) {
    console.error("Erreur lors de la création du noeud : ", error);
  }
}

// fonction de la version 1 de l'application 

export async function createRelationship(
  session: Session,
  fromId: string,
  fromLabel: string,
  toId: string,
  toLabel: string,
  relationshipType: string,
): Promise<void> {
  const query = `
        MATCH (a:${fromLabel} {ID: $fromId}), (b:${toLabel} {ID: $toId})
        CREATE (a)-[:${relationshipType}]->(b)
    `;
  try {
    await session.run(query, { fromId, toId });
  } catch (error) {
    console.error("Erreur lors de la création de la relation : ", error);
  }
}
// fin  de la fonction de la v1

//version 2 de lapp

// Fonction pour créer une relation Continent → Country
export async function createContinentToCountryRelationship(
  session: Session,
  continentId: number,
  countryId: number,
): Promise<void> {
  const query = `
    MATCH (continent:Continent {id: $continentId}), (country:Country {id: $countryId})
    MERGE (continent)-[:HAS_COUNTRY]->(country)
  `;
  try {
    await session.run(query, { continentId, countryId });
    console.log(`Relation HAS_COUNTRY créée entre le continent ${continentId} et le pays ${countryId}`);
  } catch (error) {
    console.error("Erreur lors de la création de la relation Continent-Country :", error);
  }
}

// Fonction pour créer une relation Country → City
export async function createCountryToCityRelationship(
  session: Session,
  countryId: number,
  cityId: number,
): Promise<void> {
  const query = `
    MATCH (country:Country {id: $countryId}), (city:City {id: $cityId})
    MERGE (country)-[:HAS_CITY]->(city)
  `;
  try {
    await session.run(query, { countryId, cityId });
    console.log(`Relation HAS_CITY créée entre le pays ${countryId} et la ville ${cityId}`);
  } catch (error) {
    console.error("Erreur lors de la création de la relation Country-City :", error);
  }
}

// Fonction pour créer une relation City → Place
export async function createCityToPlaceRelationship(
  session: Session,
  cityId: number,
  placeId: number,
): Promise<void> {
  const query = `
    MATCH (city:City {id: $cityId}), (place:Place {id: $placeId})
    MERGE (city)-[:HAS_PLACE]->(place)
  `;
  try {
    await session.run(query, { cityId, placeId });
    console.log(`Relation HAS_PLACE créée entre la ville ${cityId} et le lieu ${placeId}`);
  } catch (error) {
    console.error("Erreur lors de la création de la relation City-Place :", error);
  }
}

// Fonction pour créer une relation Place → Theme
export async function createPlaceToThemeRelationship(
  session: Session,
  placeId: number,
  themeId: string,
): Promise<void> {
  const query = `
    MATCH (place:Place {id: $placeId}), (theme:Theme {id: $themeId})
    MERGE (place)-[:HAS_THEME]->(theme)
  `;
  try {
    await session.run(query, { placeId, themeId });
    console.log(`Relation HAS_THEME créée entre le lieu ${placeId} et le thème ${themeId}`);
  } catch (error) {
    console.error("Erreur lors de la création de la relation Place-Theme :", error);
  }
}

// Fonction pour créer une relation Theme → Theme (hiérarchie)
export async function createThemeHierarchyRelationship(
  session: Session,
  themeId: number,
  superclassId: number,
): Promise<void> {
  const query = `
    MATCH (theme:Theme {id: $themeId}), (superclass:Theme {id: $superclassId})
    MERGE (theme)-[:IS_SUBCLASS_OF]->(superclass)
  `;
  try {
    await session.run(query, { themeId, superclassId });
    console.log(`Relation IS_SUBCLASS_OF créée entre le thème ${themeId} et le thème parent ${superclassId}`);
  } catch (error) {
    console.error("Erreur lors de la création de la relation Theme-Hierarchy :", error);
  }
}
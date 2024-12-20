import neo4j, { Driver, Session } from "https://deno.land/x/neo4j_driver_lite@5.14.0/mod.ts";

const driver: Driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);

export const getSession = (): Session => driver.session();

export const closeSession = async (session: Session) => {
  await session.close();
};

export const closeDriver = async () => {
  await driver.close();
};

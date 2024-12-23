import neo4j, {
  Driver,
  Session,
} from "https://deno.land/x/neo4j_driver_lite@5.14.0/mod.ts";

export function connectToDatabase(
  url: string,
  username: string,
  password: string,
) {
  const driver = neo4j.driver(url, neo4j.auth.basic(username, password));
  const session = driver.session();
  return { driver, session };
}

export async function closeConnection(driver: Driver, session: Session) {
  await session.close();
  await driver.close();
}

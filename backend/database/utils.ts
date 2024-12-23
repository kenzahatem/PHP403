import { readJson } from "https://deno.land/std@0.66.0/fs/read_json.ts";

export async function readJsonTyped<T>(path: string): Promise<T> {
  return await readJson(path) as T;
}

import { closeConnection, connectToDatabase } from "./Database.ts";
import { Session } from "https://deno.land/x/neo4j_driver_lite@5.14.0/mod.ts";
import { config } from "./config.ts";

type SessionCallback<T> = (session: Session, ...args: any[]) => Promise<T>;

/**
 * Higher-order function that opens a session, runs a callback, and closes session + driver.
 */
export async function runWithSession<T>(
  fn: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> {
  const { driver, session } = connectToDatabase(
    config.url,
    config.username,
    config.password,
  );
  try {
    return await fn(...args, session);
  } finally {
    await closeConnection(driver, session);
  }
}

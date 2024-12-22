import { readJson } from "https://deno.land/std@0.66.0/fs/read_json.ts";

export async function readJsonTyped<T>(path: string): Promise<T> {
  return await readJson(path) as T;
}

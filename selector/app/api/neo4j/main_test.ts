import { assertEquals } from "@std/assert";
import { add } from "./main.ts";
import neo4j from "https://deno.land/x/neo4j_lite_client@4.4.1-preview2/mod.ts";


Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});



// neo4j+s://6cf55d7c.databases.neo4j.io
// v3Mgita2vBiw0Vc_34Ul2Y1Np2MrdYTWvnD2tpSVxV8
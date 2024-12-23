import { Context, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

import {
  fetchAllNodes,
  fetchNodeById,
  fetchNodesByNameFragmentWithLabel,
  fetchNodesByNameFragmentWithoutLabel,
  fetchPlacesByThemeNameFragment,
  searchFromQuery,
} from "../controllers/nodeController.ts";
import { createSingleParamGetRouteHandler } from "./routeFactory.ts";

const router = new Router();

// version simplifiée
// router.get("/nodes", fetchAllNodes);
// router.get("/nodes/:id", fetchNodeById);

// Route pour récupérer tous les noeuds
router.get("/nodes", async (context: Context) => {
  try {
    const nodes = await fetchAllNodes();
    context.response.body = nodes;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      error: "Erreur lors de la récupération des noeuds.",
    };
  }
});

// We use a boilerplate error handling code defined in `routeFactory.ts`
router.get(
  "/nodes/:id",
  createSingleParamGetRouteHandler({
    paramName: "id",
    fetchFn: fetchNodeById,
    notFoundLabel: "node",
  }),
);

router.get(
  "/nodes/search/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchNodesByNameFragmentWithoutLabel,
    notFoundLabel: "nodes",
  }),
);

// Example route: label specified
// GET /nodes/<Label>/search/<someSubstring>
router.get("/nodes/:label/search/:query", async (context) => {
  const { label, query } = context.params;

  if (!label) {
    context.throw(400, "Label parameter is missing");
  }
  if (!query) {
    context.throw(400, "Query parameter is missing");
  }

  try {
    const nodes = await fetchNodesByNameFragmentWithLabel(label, query);
    if (nodes && nodes.length > 0) {
      context.response.body = nodes;
    } else {
      context.response.status = 404;
      context.response.body = { error: "No matching nodes found." };
    }
  } catch (error) {
    context.response.status = 500;
    context.response.body = { error: "Error fetching nodes." };
  }
});

router.get(
  "/places/theme/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchPlacesByThemeNameFragment,
    notFoundLabel: "places",
  }),
);

router.get(
  "/search/places/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: searchFromQuery,
    notFoundLabel: "places",
  }),
);

export default router;

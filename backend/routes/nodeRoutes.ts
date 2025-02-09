import { Context, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

import {
  fetchAllNodes,
  fetchNodeById,
  fetchNodesByNameFragmentWithoutLabel,
  fetchPlacesByThemeNameFragment,
  fetchCitiesByCountryNameFragment , 
  fetchCountriesByContinentNameFragment , 
  fetchPlacesByCityNameFragment,
  fetchNodesByLabel , 
  fetchNodesRelatedToSpecifiedNode,
  fetchMetricsWithPagination,
  fetchPrincipleThemes , 
  fetchPlacesRelatedToTheme
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
  "/places-to-theme/:id",
  createSingleParamGetRouteHandler({
    paramName: "id",
    fetchFn: fetchPlacesRelatedToTheme,
    notFoundLabel: "node",
  }),
);



router.get(
  "/nodes/label/:label",
  createSingleParamGetRouteHandler({
    paramName: "label",
    fetchFn: fetchNodesByLabel,
    notFoundLabel: "nodes",
  }),
);

router.get("/nodes/search/by-name", async (ctx) => {
  const query = ctx.request.url.searchParams.get("query");
  let skip = parseInt(ctx.request.url.searchParams.get('skip') || "0", 10);
  let limit = parseInt(ctx.request.url.searchParams.get('limit') || "20", 10);


  if (!query) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing 'query' parameter" };
    return;
  }

  try {
    const results = await fetchNodesByNameFragmentWithoutLabel(query, limit, skip);
    if (!results || results.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: `No nodes found for query "${query}"` };
    } else {
      ctx.response.body = results;
    }
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
});



router.get(
  "/search/places/theme/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchPlacesByThemeNameFragment,
    notFoundLabel: "places",
  }),
);


router.get(
  "/search/countries/continent/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchCountriesByContinentNameFragment,
    notFoundLabel: "countries by continent",
  })
);

// Route pour récupérer les villes par fragment de nom de pays
router.get(
  "/search/cities/country/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchCitiesByCountryNameFragment,
    notFoundLabel: "cities by country",
  })
);

// Route pour récupérer les lieux par fragment de nom de ville
router.get(
  "/search/places/city/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchPlacesByCityNameFragment,
    notFoundLabel: "places by city",
  })
);


//Route pour récupérer les noeuds qui sont associés à un noeud spécifié 
router.get(
  "/relatednodes/:query",
  createSingleParamGetRouteHandler({
    paramName: "query",
    fetchFn: fetchNodesRelatedToSpecifiedNode,
    notFoundLabel: "nodes",
  })
);
//route pour récupérer les thèmes principales 

router.get("/principle-nodes", async (context: Context) => {
  try {
    const nodes = await fetchPrincipleThemes();
    context.response.body = nodes;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      error: "Erreur lors de la récupération des noeuds.",
    };
  }
});

router.get("/metrics", async (context) => {
  const url = context.request.url;
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (!startDate || !endDate) {
    context.response.status = 400;
    context.response.body = { error: "Missing startDate or endDate query params" };
    return;
  }

  try {
    const metrics = await fetchMetricsWithPagination(startDate, endDate);
    context.response.body = metrics;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    context.response.status = 500;
    context.response.body = { error: "Error fetching metrics" };
  }
});



export default router;
//Unused 
// router.get(
//   "/search/places/:query",
//   createSingleParamGetRouteHandler({
//     paramName: "query",
//     fetchFn: searchFromQuery,
//     notFoundLabel: "places",
//   }),
// );
// router.get("/nodes/:label/search/:query", async (context) => {
//   const { label, query } = context.params;

//   if (!label) {
//     context.throw(400, "Label parameter is missing");
//   }
//   if (!query) {
//     context.throw(400, "Query parameter is missing");
//   }

//   try {
//     const nodes = await fetchNodesByNameFragmentWithLabel(label, query);
//     if (nodes && nodes.length > 0) {
//       context.response.body = nodes;
//     } else {
//       context.response.status = 404;
//       context.response.body = { error: "No matching nodes found." };
//     }
//   } catch (error) {
//     context.response.status = 500;
//     context.response.body = { error: "Error fetching nodes." };
//   }
// });


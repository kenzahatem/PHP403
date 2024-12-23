import { Context, Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

import {
  fetchAllNodes,
  fetchNodeById,
  fetchNodesByNameFragmentWithLabel,
  fetchNodesByNameFragmentWithoutLabel,
  fetchPlacesByThemeNameFragment,
} from "../controllers/nodeController.ts";

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

// Route pour récupérer un noeud par ID
router.get("/nodes/:id", async (context) => {
  const id = context.params.id;
  if (!id) {
    context.response.status = 400;
    context.response.body = { error: "ID requis." };
    return;
  }

  try {
    const node = await fetchNodeById(id);
    if (node) {
      context.response.body = node;
    } else {
      context.response.status = 404;
      context.response.body = { error: "Noeud introuvable." };
    }
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      error: "Erreur lors de la récupération du noeud.",
    };
  }
});

// Example route: label not specified
// GET /nodes/search/<someSubstring>
router.get("/nodes/search/:query", async (context) => {
  const query = context.params.query;

  if (!query) {
    context.response.status = 400;
    context.response.body = { error: "Substring (query) required." };
    return;
  }

  try {
    const nodes = await fetchNodesByNameFragmentWithoutLabel(query);
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

// Example route: label specified
// GET /nodes/<Label>/search/<someSubstring>
router.get("/nodes/:label/search/:query", async (context) => {
  const { label, query } = context.params;

  if (!label) {
    context.response.status = 400;
    context.response.body = { error: "Label required." };
    return;
  }
  if (!query) {
    context.response.status = 400;
    context.response.body = { error: "Substring (query) required." };
    return;
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

// Get places that are linked to a theme containing the query in its name
router.get("/places/theme/:query", async (context) => {
  const fragment = context.params.query;
  if (!fragment) {
    context.throw(400, "Query parameter is missing");
  }

  try {
    const places = await fetchPlacesByThemeNameFragment(fragment);
    if (places.length === 0) {
      context.response.status = 404;
      context.response.body = { error: "No places found." };
    } else {
      context.response.body = places;
    }
  } catch (error) {
    console.error(error);
    context.response.status = 500;
    context.response.body = { error: "Server error." };
  }
});

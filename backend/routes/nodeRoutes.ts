import { Router, Context } from "https://deno.land/x/oak@v12.5.0/mod.ts";

import { fetchAllNodes, fetchNodeById } from "../controllers/nodeController.ts";

const router = new Router();

// Route pour récupérer tous les noeuds
router.get("/nodes", async (context : Context ) => {
  try {
    const nodes = await fetchAllNodes();
    context.response.body = nodes;
  } catch (error) {
    context.response.status = 500;
    context.response.body = { error: "Erreur lors de la récupération des noeuds." };
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
    context.response.body = { error: "Erreur lors de la récupération du noeud." };
  }
});

export default router;

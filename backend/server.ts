import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";

import nodeRoutes from "./routes/nodeRoutes.ts";

const app = new Application();


// Middleware pour les routes
app.use(nodeRoutes.routes());
app.use(nodeRoutes.allowedMethods());

// Lancement du serveur
const PORT = 8000;
console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
await app.listen({ port: PORT });

// deno run --allow-net --allow-sys server.ts => lancer le serveur 

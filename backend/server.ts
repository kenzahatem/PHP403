import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { responseTimeLogger } from "./middlewares/responseTime.ts";

import nodeRoutes from "./routes/nodeRoutes.ts";

const app = new Application();

// Add the response time logger middleware
app.use(responseTimeLogger);

app.use(oakCors()); 
// Middleware pour les routes
app.use(nodeRoutes.routes());
app.use(nodeRoutes.allowedMethods());

// Lancement du serveur
const PORT = 8000;
console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
await app.listen({ port: PORT });

// deno task dev  => lancer le serveur 

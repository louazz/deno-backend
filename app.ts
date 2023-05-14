import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./src/routes/allRoutes.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

const PORT = 8000;

app.use(oakCors({   origin: 'http://64.226.102.153:8000',
optionsSuccessStatus: 200,}));
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Application is listening on port: " + PORT);

await app.listen({ port: PORT });

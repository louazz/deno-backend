import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./src/routes/allRoutes.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

const PORT = 5000;

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Application is listening on port: " + PORT);

await app.listen({ port: PORT });

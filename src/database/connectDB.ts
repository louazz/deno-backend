import { MongoClient } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

const client = new MongoClient();

const dbString= "mongodb://mongo:5000";

await client.connect(dbString);

console.log("Database connected!");

const db= client.database("admin");
export default db;
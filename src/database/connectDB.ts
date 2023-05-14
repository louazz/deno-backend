import { MongoClient } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

const client = new MongoClient();

//const dbString= "mongodb://encrygen@gmail.com:12AZqswx!!@cluster0.xtqgb.mongodb.net/?retryWrites=true&w=majority";
//await client.connect("mongodb://doadmin:JaR1T76me29045XV@db-mongodb-fra1-11164-4de1e314.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-fra1-11164");
await client.connect(
  "mongodb+srv://doadmin:JaR1T76me29045XV@db-mongodb-fra1-11164-4de1e314.mongo.ondigitalocean.com/admin?authMechanism=SCRAM-SHA-1",
);
console.log("Database connected!");

const db= client.database("admin");
export default db;
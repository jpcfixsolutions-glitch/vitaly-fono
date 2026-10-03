import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import config from "../../config.js";

const client = createClient({
  url: config.urlDB,
  authToken: config.tokenDB
});

const db = drizzle(client);

export default db;
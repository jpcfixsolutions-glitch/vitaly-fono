import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import { role as roleSchema } from "../role/index.js";

export const user = sqliteTable("Usuario", {
  id: text("id").primaryKey().notNull(),
  id_rol: text("id_rol").notNull().references(() => roleSchema.id),
  name: text("nombre").notNull(),
  last_name: text("apellido").notNull(),
  email: text("email").notNull().unique(),
  password: text("contrasena").notNull(),
  status: text("estado").notNull().default("Activo"),
  last_login: text("ultimo_login"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});

import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "../user/userSchema.js";

export const healthInsurance = sqliteTable("ObraSocial", {
  id: text("id").primaryKey().notNull(),
  name: text("nombre").notNull(),
  status: text("estado").notNull().default("Activo"),
  id_user: text("id_usuario").notNull().references(() => user.id),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});

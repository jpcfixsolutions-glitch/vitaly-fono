import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const privilege = sqliteTable("privilegio", {
  id: text("id").primaryKey().notNull(),
  name: text("nombre").notNull(),
  description: text("descripcion"),
  status: text("estado").notNull().default("Activo"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});
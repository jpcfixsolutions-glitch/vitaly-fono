import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const role = sqliteTable("rol", {
    id: text("id").primaryKey().notNull(),
    name: text("nombre").notNull(),
    description: text("descripcion"),
    status: text("estado").default("Activo").notNull(),
    created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});
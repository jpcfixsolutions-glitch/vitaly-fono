import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const sibling = sqliteTable("Hermano",{
    id: text("id").primaryKey().notNull(),
    id_interview: text("id_entrevista").notNull().references(() => firstInterview.id),
    name: text("nombre"),
    age: text("edad"),
    studies: text("estudios"),
    created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
})
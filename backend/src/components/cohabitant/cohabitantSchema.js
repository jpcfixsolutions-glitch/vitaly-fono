import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const cohabitant = sqliteTable("Conviviente", {
  id: text("id").primaryKey().notNull(),
  id_interview: text("id_entrevista").notNull().references(() => firstInterview.id),
  domestic_cohabitation: text("convivencia_domestica"),
  non_domestic_cohabitation: text("convivencia_no_domestica"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`)
});

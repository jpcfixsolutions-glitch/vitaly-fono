import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const father = sqliteTable("Padre", {
  id: text("id").primaryKey().notNull(),
  id_interview: text("id_entrevista").notNull().references(() => firstInterview.id),
  father_name: text("nombre"),
  father_age: text("edad"),
  father_lives: integer("vive"),
  father_profession: text("profesion_estudios"),
  father_work_hours: text("horarios_laborales"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});





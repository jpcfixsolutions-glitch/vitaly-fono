import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const mother = sqliteTable("Madre", {
  id: text("id").primaryKey().notNull(),
  id_interview: text("id_entrevista").notNull().references(() => firstInterview.id),
  mother_name: text("nombre"),
  mother_age: text("edad"),
  mother_lives: integer("vive"),
  mother_profession: text("profesion_estudios"),
  mother_work_hours: text("horarios_laborales"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});


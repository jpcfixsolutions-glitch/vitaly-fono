import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const schooling = sqliteTable("Escolaridad", {
  id: text("id").primaryKey().notNull(),
  id_interview: text("id_entrevista").notNull().references(() => firstInterview.id),
  schooling_year: text("anio_escolaridad"),
  current_course: text("curso_actual"),
  orientation: text("orientacion"),
  school_name: text("colegio"),
  repeat_course: integer("repitio_curso").default(0),
  repeat_course_reason: text("motivo_repeticion"),
  school_changes: integer("cambios_colegio").default(0),
  school_changes_reason: text("motivo_cambios_colegio"),
  initial_level: text("nivel_inicial"),
  primary_level: text("nivel_primario"),
  secondary_level: text("nivel_secundario"),
  general_remarks: text("observaciones_generales"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});


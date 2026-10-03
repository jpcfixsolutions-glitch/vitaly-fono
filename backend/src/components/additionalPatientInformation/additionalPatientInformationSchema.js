import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const patientAdditionalInfo = sqliteTable("InformacionAdicionalPaciente", {
  id: text("id").primaryKey().notNull(),
  id_interview: text("id_entrevista")
    .notNull()
    .references(() => firstInterview.id),
  civil_status: text("estado_civil"),
  second_phone: integer("segundo_telefono"),
  living_with: text("con_quien_vive"),
  profession: text("profesion"),
  derivation: text("derivacion"),
  has_had_therapy: integer("a_realizado_terapia").default(0),
  therapy_duration: text("cuanto_tiempo_realizo_terapia"),
  reason_for_leaving_therapy: text("motivo_terapia_dejada"),
  current_therapy_type: text("corriente"),
  created_at: text("creado_en")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
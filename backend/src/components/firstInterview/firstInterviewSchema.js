import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { patient } from "../patient/patientSchema.js";
import { user } from "../user/userSchema.js";

export const firstInterview = sqliteTable("PrimeraEntrevista", {
  id: text("id").primaryKey().notNull(),
  id_patient: text("id_paciente").notNull().references(() => patient.id),
  id_user: text("id_usuario").notNull().references(() => user.id),
  date: text("fecha").notNull(),
  family_dynamics: text("dinamicas_familiares"),
  perinatal_history: text("antecedentes_perinatal"),
  general_development: text("desarrollo_general"),
  diseases_allergies: text("enfermedades_alergias"),
  family_pathology_history: text("historia_familiar_patologias"),
  personality_description: text("personalidad_descripcion"),
  reason_for_consultation: text("motivo_consulta"),
  genogram: text("genograma"),
  status: text("estado").notNull().default("Activo"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
},
  (table) => {
    return {
      uniqueFirstInterviewPerPatient: uniqueIndex(
        "uniq_primeraentrevista_id_paciente"
      ).on(table.id_patient),
    };
  }
);


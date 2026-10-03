import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { firstInterview } from "../firstInterview/firstInterviewSchema.js";

export const adultAntecedentsAdditionalInfo = sqliteTable(
  "InformacionAdicionalAntecendentesAdultos",
  {
    id: text("id").primaryKey().notNull(),
    id_interview: text("id_entrevista")
      .notNull()
      .references(() => firstInterview.id),
    pathologies_diseases: text("patologias_enfermedades"),
    medication: text("medicacion"),
    substance_alcohol_consumption: text("consumo_sustancias_alcohol"),
    hobbies_sports: text("pasatiempo_deportes"),
    negative_thoughts: text("pensamientos_negativos"),
    abuse_mistreatment: text("abusos_maltratos"),
    created_at: text("creado_en")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("actualizado_en")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  }
);
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { patient } from "../patient/patientSchema.js";

export const patientDischarge = sqliteTable("CierreTratamiento", {
  id: text("id").primaryKey().notNull(),
  id_patient: text("id_paciente").notNull().references(() => patient.id),
  type: text("tipo").notNull(),
  // date: text("fecha").default(sql`CURRENT_TIMESTAMP`),
  date: text("fecha").notNull(),
  closing_reason: text("razon_cierre").notNull(),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});
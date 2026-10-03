import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { documentType } from "../documentType/documentTypeSchema.js";
import { healthInsurance } from "../healthInsurance/healthInsuranceSchema.js";
import { user } from "../user/userSchema.js";
import { sql } from "drizzle-orm";

export const patient = sqliteTable("Paciente", {
  id: text("id").primaryKey().notNull(),
  name: text("nombre").notNull(),
  last_name: text("apellido").notNull(),
  // ToDo: incluir CUIL, los números de documentos pueden ser duplicados. Adaptar.
  id_document_type: text("id_tipo_documento").notNull().references(() => documentType.id),
  document_number: text("numero_documento").notNull().unique(),
  phone: integer("telefono").notNull(),
  birth_date: text("fecha_nacimiento"),
  id_health_insurance: text("id_obra_social").references(() => healthInsurance.id),
  status: text("estado").notNull().default("Activo"),
  email: text("email"),
  address: text("direccion"),
  id_user: text("id_usuario").notNull().references(() => user.id),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});
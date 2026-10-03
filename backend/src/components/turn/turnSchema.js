import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { documentType } from "../documentType/documentTypeSchema.js";
import { user } from "../user/userSchema.js";

// ToDo: cambiar todos estos datos por el id de paciente para que no haya redundancia de datos
export const turns = sqliteTable("Turno", {
  id: text("id").primaryKey().notNull(),
  name: text("nombre").notNull(),
  last_name: text("apellido").notNull(),
  phone: text("telefono").notNull(),
  modality: text("modalidad").notNull(),
  date: text("fecha").notNull(),
  id_document_type: text("id_tipo_documento").notNull().references(() => documentType.id),
  document_number: text("numero_documento").notNull(),
  new_patient: integer("paciente_nuevo").notNull().default(0),
  status: text("estado").notNull().default("Activo"),
  id_user: text("id_usuario").notNull().references(() => user.id),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});

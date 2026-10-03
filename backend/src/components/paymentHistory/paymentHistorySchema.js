import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { session } from "../session/sessionSchema.js";
import { patient } from "../patient/patientSchema.js";
import { healthInsurance } from "../healthInsurance/healthInsuranceSchema.js";
import { paymentMethod } from "../paymentMethod/paymentMethodSchema.js";
import { typeServiceTable } from "../typeService/typeServiceSchema.js";
import { user } from "../user/userSchema.js";

export const paymentHistory = sqliteTable("historialCobro", {
  id: text("id").primaryKey().notNull(),
  id_user: text("id_usuario").notNull().references(() => user.id),
  id_session: text("id_sesion").notNull().references(() => session.id),
  id_patient: text("id_paciente").notNull().references(() => patient.id),
  id_health_insurance: text("id_obra_social").references(() => healthInsurance.id),
  id_payment_method: text("id_metodo_pago").notNull().references(() => paymentMethod.id),
  id_service: text("id_servicio").notNull().references(() => typeServiceTable.id),
  amount: integer("monto").notNull(),
  paid_at: text("fecha").notNull().default(sql`CURRENT_TIMESTAMP`),
  status: text("estado").notNull().default("Activo"),
  notes: text("notas"),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});



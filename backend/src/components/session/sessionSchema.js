import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const session = sqliteTable("sesion", {
    id: text("id").primaryKey().notNull(),
    id_patient: text("id_paciente").notNull(),
    id_user: text("id_usuario").notNull(),
    // El servicio se selecciona al registrar el cobro; al confirmar el turno
    // todavía puede no estar definido.
    id_service: text("id_servicio"),
    id_turn: text("id_turno"),
    session_date: text("fecha").notNull(),
    clinical_notes: text("notas_clinicas"),
    status: text("estado").notNull().default("Activo"),
    created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});

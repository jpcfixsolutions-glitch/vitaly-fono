import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "../user/userSchema.js";

export const calendarSchema = sqliteTable("DiagramaCalendario", {
  id: text("id").primaryKey().notNull(),
  day: text("dia").notNull(),
  start_time: text("horario_desde").notNull(),
  end_time: text("horario_hasta").notNull(),
  id_user: text("id_usuario").notNull().references(() => user.id),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("actualizado_en").notNull().default(sql`CURRENT_TIMESTAMP`)
})
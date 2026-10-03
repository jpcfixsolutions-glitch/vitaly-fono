import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { session } from "../session/sessionSchema.js";

export const archiveAttachment = sqliteTable("ArchivoAdjunto", {
  id: text("id").primaryKey().notNull(),
  id_session: text("id_sesion").notNull().references(() => session.id),
  filename: text("nombre_archivo").notNull(),
  original_name: text("nombre_original").notNull(),
  mimetype: text("tipo_mime").notNull(),
  path: text("ruta").notNull(),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});
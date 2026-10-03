import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "../user/userSchema.js";

export const refreshTokenSchema = sqliteTable("TokenRefresco", {
  id: text("id").primaryKey().notNull(),
  id_user: text("id_usuario").notNull().references(() => user.id),
  token_hashed: text("token_hasheado").notNull().unique(),
  expires_at: text("expira_en").notNull(),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
});
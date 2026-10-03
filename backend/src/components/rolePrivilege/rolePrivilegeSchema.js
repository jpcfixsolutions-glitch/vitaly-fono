import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { role } from "../role/roleSchema.js";
import { privilege } from "../privilege/privilegeSchema.js";

export const rolePrivilege = sqliteTable("rol_privilegio", {
  id_role: text("id_rol").notNull().references(() => role.id),
  id_privilege: text("id_privilegio").notNull().references(() => privilege.id),
  created_at: text("creado_en").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  pk: primaryKey({ columns: [table.id_role, table.id_privilege] }),
}));
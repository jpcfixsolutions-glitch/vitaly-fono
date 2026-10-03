import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { privilege } from "./privilegeSchema.js";
import { v4 as uuid } from "uuid";
import { eq, sql } from "drizzle-orm";
import { rolePrivilege } from "../rolePrivilege/rolePrivilegeSchema.js";

/**
 * Obtiene todos los privilegios disponibles
 * 
 * @returns {Promise<Array>} Array con todos los privilegios encontrados
 * @returns {string} returns.id - ID del privilegio
 * @returns {string} returns.name - Nombre del privilegio
 * @returns {string} returns.description - Descripción del privilegio
 * @returns {string} returns.created_at - Fecha de creación
 * @returns {string} returns.updated_at - Fecha de actualización
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getAllPrivileges = async () => {
  try {
    const privileges = await db.select().from(privilege).all();
    return privileges;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los privilegios.", 500, []);
  }
};

/**
 * Obtiene un privilegio específico por su ID
 * 
 * @param {string} id - ID del privilegio a buscar
 * @returns {Promise<Object>} El privilegio encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPrivilegeById = async (id) => {
  try {
    const privilegeFound = await db.select().from(privilege).where(eq(privilege.id, id)).get();
    return privilegeFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el privilegio", 500, []);
  }
};

/**
 * Obtiene un privilegio específico por su nombre
 * 
 * @param {string} name - Nombre del privilegio a buscar
 * @returns {Promise<Object>} El privilegio encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */

const getPrivilegeByName = async (name) => {
  try {
    const privilegeFound = await db.select().from(privilege).where(eq(sql`LOWER(${privilege.name})`, sql`LOWER(${name})`)).get();
    return privilegeFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el privilegio.", 500, []);
  }
};

/**
  * Crea un nuevo privilegio en la base de datos
 * 
 * @param {Object} dataPrivilege - Datos del privilegio a crear
 * @param {string} dataPrivilege.name - Nombre del privilegio
 * @param {string} dataPrivilege.description - Descripción del privilegio (opcional)
 * @returns {Promise<Object>} El privilegio creado
 * @throws {AppError} Si ocurre un error al crear el privilegio
 */

const createPrivilege = async (dataPrivilege) => {
  try {
    const newPrivilege = {
      id: uuid(),
      ...dataPrivilege
    };

    const insertedPrivilege = await db.insert(privilege).values(newPrivilege).returning().get();
    return insertedPrivilege;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el privilegio.", 500, []);
  }
};

/**
 * Actualiza un privilegio en la base de datos
 * 
 * @param {string} id - ID del privilegio a actualizar
 * @param {Object} dataPrivilege - Datos del privilegio a actualizar
 * @returns {Promise<Object>} El privilegio actualizado
 * @throws {AppError} Si ocurre un error al actualizar el privilegio
 */

const updatePrivilege = async (id, dataPrivilege) => {
  try {
    const updatedPrivilege = await db.update(privilege).set(dataPrivilege).where(eq(privilege.id, id)).returning().get();
    return updatedPrivilege;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar el privilegio.", 500, []);
  }
};

/**
 * Elimina un privilegio de la base de datos (eliminación lógica)
 * 
 * @param {string} id - ID del privilegio a eliminar
 * @returns {Promise<Object>} El privilegio eliminado
 * @throws {AppError} Si ocurre un error al eliminar el privilegio
 */
const deletePrivilege = async (id) => {
  return await db
    .update(privilege)
    .set({
      status: "Inactivo",
      updated_at: new Date().toISOString()
    })
    .where(eq(privilege.id, id))
    .returning();
};

/**
 * Devuelve los privilegios asociados a un id_rol
 * @param {string} id_rol
 * @returns {Promise<Array<string>>}
 */
const getUserPrivileges = async (id_rol) => {
  try {
    const result = await db
      .select({ name: privilege.name })
      .from(rolePrivilege)
      .leftJoin(privilege, eq(rolePrivilege.id_privilege, privilege.id))
      .where(eq(rolePrivilege.id_role, id_rol));
    return result.map(p => p.name);
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los privilegios del usuario.", 500, []);
  }
};

export const privilegeService = {
  getAllPrivileges,
  getPrivilegeById,
  getPrivilegeByName,
  createPrivilege,
  updatePrivilege,
  deletePrivilege,
  getUserPrivileges,
};
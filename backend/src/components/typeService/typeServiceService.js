import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { typeServiceTable } from "./typeServiceSchema.js";
import { v4 as uuid } from "uuid";
import { eq, sql, and } from "drizzle-orm";

/**
 * Obtiene todos los tipos de servicios disponibles.
 *
 * @async
 * @function getAllTypeService
 * @returns {Promise<Array<Object>>} Lista de objetos con los tipos de servicio encontrados.
 * Cada objeto incluye las siguientes propiedades:
 *   - {string} id - ID del tipo de servicio.
 *   - {string} name - Nombre del tipo de servicio.
 *   - {string} description - Descripción del tipo de servicio.
 *   - {number} price - Precio del tipo de servicio.
 *   - {string} status - Estado del tipo de servicio.
 *   - {string} created_at - Fecha de creación.
 *   - {string} updated_at - Fecha de última actualización.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getAllTypeService = async () => {
  try {
    const typeServices = await db.select().from(typeServiceTable).all();
    return typeServices;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener tipos de servicios.", 400, []);
  }
};

/**
 * Obtiene un tipo de servicio específico por su ID.
 *
 * @async
 * @function getTypeServiceById
 * @param {string} id - ID del servicio.
 * @returns {Promise<Object|null>} Objeto con el tipo de servicio encontrado, o null si no existe.
 *   - {string} id - ID del tipo de servicio.
 *   - {string} name - Nombre del tipo de servicio.
 *   - {string} description - Descripción del tipo de servicio.
 *   - {number} price - Precio del tipo de servicio.
 *   - {string} status - Estado del tipo de servicio.
 *   - {string} created_at - Fecha de creación.
 *   - {string} updated_at - Fecha de última actualización.
 * @throws {AppError} Si ocurre un error al obtener el servicio.
 */
const getTypeServiceById = async (id) => {
  try {
    const typeServiceFound = await db.select().from(typeServiceTable).where(eq(typeServiceTable.id, id)).get();
    return typeServiceFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el servicio.", 500, []);
  }
};

/**
 * Busca un tipo de servicio por su nombre y usuario.
 *
 * @async
 * @function getTypeServiceByName
 * @param {string} name - Nombre del tipo de servicio a buscar.
 * @param {string} id_user - ID del usuario propietario del servicio.
 * @returns {Promise<Object|null>} Objeto del tipo de servicio encontrado o null si no existe.
 *   - {string} id - ID del tipo de servicio.
 *   - {string} name - Nombre del tipo de servicio.
 *   - {string} description - Descripción del tipo de servicio.
 *   - {number} price - Precio del tipo de servicio.
 *   - {string} status - Estado del tipo de servicio.
 *   - {string} created_at - Fecha de creación.
 *   - {string} updated_at - Fecha de última actualización.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getTypeServiceByName = async (name, id_user) => {
  try {
    const typeServiceFound = await db.select().from(typeServiceTable).where(and(eq(sql`LOWER(${typeServiceTable.name})`, sql`LOWER(${name})`), eq(typeServiceTable.id_user, id_user))).get();
    return typeServiceFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el servicio.", 500, []);
  }
};

/**
 * Crea un nuevo tipo de servicio en la base de datos.
 *
 * @async
 * @function createTypeService
 * @param {Object} dataTypeService - Datos del tipo de servicio a crear.
 *   - {string} name - Nombre del tipo de servicio.
 *   - {string} description - Descripción del tipo de servicio.
 *   - {number} price - Precio del tipo de servicio.
 *   - {string} id_user - ID del usuario que crea el servicio.
 *   - {string} status - Estado del tipo de servicio.
 *   - {string} created_at - Fecha de creación (opcional).
 *   - {string} updated_at - Fecha de actualización (opcional).
 * @returns {Promise<Object>} El tipo de servicio creado, incluyendo su {string} id generado.
 * @throws {AppError} Si ocurre un error al crear el tipo de servicio.
 */
const createTypeService = async (dataTypeService) => {
  try {
    const newTypeService = {
      id: uuid(),
      ...dataTypeService
    };
    const insertedTypeService = await db.insert(typeServiceTable).values(newTypeService).returning().get();
    return insertedTypeService;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el servicio.", 500, []);
  }
};

/**
 * Actualiza un tipo de servicio en la base de datos.
 *
 * @async
 * @function updateTypeService
 * @param {string} id - ID del tipo de servicio a actualizar.
 * @param {Object} dataTypeService - Datos del tipo de servicio a actualizar.
 *   - {string} [name] - Nombre del tipo de servicio.
 *   - {string} [description] - Descripción del tipo de servicio.
 *   - {number} [price] - Precio del tipo de servicio.
 *   - {string} [status] - Estado del tipo de servicio.
 *   - {string} [id_user] - ID del usuario (opcional).
 *   - {string} [updated_at] - Fecha de actualización (opcional).
 * @returns {Promise<Object>} El tipo de servicio actualizado.
 * @throws {AppError} Si ocurre un error al actualizar el servicio.
 */
const updateTypeService = async (id, dataTypeService) => {
  try {
    const updatedTypeService = await db.update(typeServiceTable).set(dataTypeService).where(eq(typeServiceTable.id, id)).returning().get();
    return updatedTypeService;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar el servicio.", 500, []);
  }
};

/**
 * Da de baja (inhabilita) un tipo de servicio en la base de datos.
 *
 * @async
 * @function deactivateTypeService
 * @param {string} id - ID del tipo de servicio a dar de baja.
 * @returns {Promise<Object>} El tipo de servicio actualizado a "Inactivo".
 * @throws {AppError} Si ocurre un error al dar de baja el servicio.
 */
const deactivateTypeService = async (id) => {
  try {
    const typeServiceDeleted = await db.update(typeServiceTable)
      .set({ status: "Inactivo" })
      .where(eq(typeServiceTable.id, id))
      .returning().get();
    return typeServiceDeleted;
  } catch (error) {
    throw new AppError("Ocurrió un error al dar de baja el servicio.", 500, []);
  }
};

export const typeServiceService = {
  getAllTypeService,
  getTypeServiceById,
  getTypeServiceByName,
  createTypeService,
  updateTypeService,
  deactivateTypeService
};
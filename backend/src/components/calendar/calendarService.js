import { AppError } from "../../../errors.js";
import { calendarSchema } from "./calendarSchema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import db from "../../database/database.js";

/**
 * Obtiene todas las configuraciones del calendario.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Retorna un array con las configuraciones encontradas o un mensaje de error.
 */
const getAllConfigurations = async () => {
  try {
    const configurations = await db.select().from(calendarSchema).all();
    return configurations;
  } catch (error) {
    throw new AppError("Error al obtener las configuraciones", 500, []);
  }
}

/**
 * Obtiene una configuración del calendario por su ID.
 *
 * @async
 * @function
 * @param {string} id - El ID de la configuración.
 * @returns {Promise<Object>} Retorna un objeto con la configuración encontrada o un mensaje de error.
 */
const getConfigurationById = async (id) => {
  try {
    const configuration = await db.select().from(calendarSchema).where(eq(calendarSchema.id, id)).get();
    return configuration;
  } catch (error) {
    throw new AppError("Error al obtener la configuración", 500, []);
  }
}

/**
 * Crea una nueva configuración para el calendario.
 *
 * @async
 * @function
 * @param {Object} data - Los datos de la configuración.
 * @returns {Promise<Object>} Retorna un objeto con la configuración creada o un mensaje de error.
 */
const createConfiguration = async (data) => {
  try {
    const newConfiguration = {
      id: uuid(),
      ...data
    }
    const insertedConfiguration = await db.insert(calendarSchema).values(newConfiguration).returning().get();
    return insertedConfiguration;
  } catch (error) {
    throw new AppError("Error al crear la configuración", 500, []);
  }
}

/**
 * Actualiza una configuración existente del calendario.
 *
 * @async
 * @function
 * @param {string} id - El ID de la configuración.
 * @param {Object} data - Los datos de la configuración.
 * @returns {Promise<Object>} Retorna un objeto con la configuración actualizada o un mensaje de error.
 */
const updateConfiguration = async (id, data) => {
  try {
    const updatedConfiguration = await db.update(calendarSchema).set(data).where(eq(calendarSchema.id, id)).returning().get();
    return updatedConfiguration;
  } catch (error) {
    throw new AppError("Error al actualizar la configuración", 500, []);
  }
}

/**
 * Elimina una configuración existente del calendario.
 *
 * @async
 * @function
 * @param {string} id - El ID de la configuración.
 * @returns {Promise<void>} Retorna un mensaje de éxito o un mensaje de error.
 */
const deleteConfiguration = async (id) => {
  try {
    await db.delete(calendarSchema).where(eq(calendarSchema.id, id));
  } catch (error) {
    throw new AppError("Error al eliminar la configuración", 500, []);
  }
}

export const calendarService = {
  getAllConfigurations,
  getConfigurationById,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration
}
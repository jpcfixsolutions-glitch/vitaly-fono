import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { mother } from "./motherSchema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

/**
 * Obtiene todas las madres.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Array con todas las madres encontradas.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getAllMothers = async () => {
  try {
    return await db.select().from(mother).all();
  } catch (error) {
    throw new AppError("Error al obtener madres", 400, []);
  }
};

/**
 * Obtiene una madre por su ID.
 *
 * @async
 * @function
 * @param {string} id - ID de la madre a buscar.
 * @returns {Promise<Object>} Objeto de la madre encontrada.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getMotherById = async (id) => {
  try {
    return await db.select().from(mother).where(eq(mother.id, id)).get();
  } catch (error) {
    throw new AppError("Error al obtener la madre", 400, []);
  }
};

/**
 * Obtiene una madre por el ID de la entrevista.
 *
 * @async
 * @function
 * @param {string} id_interview - ID de la entrevista asociada.
 * @returns {Promise<Object>} Objeto de la madre encontrada.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getMotherByInterviewId = async (id_interview) => {
  try {
    return await db.select().from(mother).where(eq(mother.id_interview, id_interview)).get();
  } catch (error) {
    throw new AppError("Error al obtener la madre por entrevista", 400, []);
  }
};

/**
 * Crea una nueva madre.
 *
 * @async
 * @function
 * @param {Object} data - Datos de la madre a crear.
 * @returns {Promise<Object>} Objeto de la madre creada.
 * @throws {AppError} Si ocurre un error al crear la madre.
 */
const createMother = async (data) => {
  try {
    const toInsert = { id: uuid(), ...data };
    const inserted = await db.insert(mother).values(toInsert).returning().get();
    return inserted;
  } catch (error) {
    throw new AppError(`Error al crear la madre: ${error.message}`, 500, []);
  }
};

/**
 * Actualiza una madre existente por su ID.
 *
 * @async
 * @function
 * @param {string} id - ID de la madre a actualizar.
 * @param {Object} data - Datos para actualizar la madre.
 * @returns {Promise<Object>} Objeto de la madre actualizada.
 * @throws {AppError} Si ocurre un error al actualizar la madre.
 */
const updateMother = async (id, data) => {
  try {
    const updated = await db.update(mother).set(data).where(eq(mother.id, id)).returning().get();
    return updated;
  } catch (error) {
    throw new AppError("Error al actualizar la madre", 400, []);
  }
};

export const motherService = {
  getAllMothers,
  getMotherById,
  getMotherByInterviewId,
  createMother,
  updateMother,
}






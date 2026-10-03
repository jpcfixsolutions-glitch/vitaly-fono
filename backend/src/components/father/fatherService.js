import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { father } from "./fatherSchema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

/**
 * Obtiene todos los padres de la base de datos.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Lista de padres.
 * @throws {AppError} Si ocurre un error al obtener los padres.
 */
const getAllFathers = async () => {
  try {
    const fathers = await db.select().from(father).all();
    return fathers;
  } catch (error) {
    throw new AppError("Error al obtener padres", 500, []);
  }
};

/**
 * Obtiene un padre por su identificador único.
 *
 * @async
 * @function
 * @param {string} id - Identificador del padre.
 * @returns {Promise<Object|null>} Objeto del padre o null si no existe.
 * @throws {AppError} Si ocurre un error al obtener el padre.
 */
const getFatherById = async (id) => {
  try {
    const fatherExists = await db.select().from(father).where(eq(father.id, id)).get();
    return fatherExists;
  } catch (error) {
    throw new AppError("Error al obtener el padre", 500, []);
  }
};

/**
 * Obtiene un padre por el identificador de la entrevista.
 *
 * @async
 * @function
 * @param {string} id_interview - Identificador de la entrevista.
 * @returns {Promise<Object|null>} Objeto del padre o null si no existe.
 * @throws {AppError} Si ocurre un error al obtener el padre por entrevista.
 */
const getFatherByInterviewId = async (id_interview) => {
  try {
    const father = await db.select().from(father).where(eq(father.id_interview, id_interview)).get();
    return father;
  } catch (error) {
    throw new AppError("Error al obtener el padre por entrevista", 500, []);
  }
};

/**
 * Crea un nuevo padre en la base de datos.
 *
 * @async
 * @function
 * @param {Object} data - Datos del padre a crear.
 * @returns {Promise<Object>} El padre creado.
 * @throws {AppError} Si ocurre un error al crear el padre.
 */
const createFather = async (data) => {
  try {
    const toInsert = { id: uuid(), ...data };
    const insertedFather = await db.insert(father).values(toInsert).returning().get();
    return insertedFather;
  } catch (error) {
    throw new AppError("Error al crear el padre", 500, []);
  }
};

/**
 * Actualiza un padre existente por su identificador.
 *
 * @async
 * @function
 * @param {string} id - Identificador del padre.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} El padre actualizado.
 * @throws {AppError} Si ocurre un error al actualizar el padre.
 */
const updateFather = async (id, data) => {
  try {
    const updatedFather = await db.update(father).set(data).where(eq(father.id, id)).returning().get();
    return updatedFather;
  } catch (error) {
    throw new AppError("Error al actualizar el padre", 500, []);
  }
};

export const fatherService = {
  getAllFathers,
  getFatherById,
  getFatherByInterviewId,
  createFather,
  updateFather,
};







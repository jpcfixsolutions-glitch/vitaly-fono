import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { cohabitant } from "./cohabitantSchema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

/**
 * Obtiene todos los convivientes de la base de datos.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} Lista de convivientes.
 * @throws {AppError} Si ocurre un error al obtener los convivientes.
 */
const getAllCohabitants = async () => {
  try {
    const cohabitants = await db.select().from(cohabitant).all();
    return cohabitants;
  } catch (error) {
    throw new AppError("Error al obtener los convivientes", 500, []);
  }
};

/**
 * Obtiene un conviviente por su identificador.
 *
 * @async
 * @function
 * @param {string} id - Identificador del conviviente.
 * @returns {Promise<Object|null>} El conviviente encontrado o null si no existe.
 * @throws {AppError} Si ocurre un error al obtener el conviviente.
 */
const getCohabitantById = async (id) => {
  try {
    const item = await db.select().from(cohabitant).where(eq(cohabitant.id, id)).get();
    return item;
  } catch (error) {
    throw new AppError("Error al obtener el conviviente", 500, []);
  }
};

/**
 * Crea un nuevo conviviente en la base de datos.
 *
 * @async
 * @function
 * @param {Object} data - Datos del nuevo conviviente.
 * @returns {Promise<Object>} El conviviente creado.
 * @throws {AppError} Si ocurre un error al crear el conviviente.
 */
const createCohabitant = async (data) => {
  try {
    const newCohabitant = {
      id: uuid(),
      ...data
    };

    const inserted = await db.insert(cohabitant).values(newCohabitant).returning().get();

    return inserted;
  } catch (error) {
    throw new AppError("Error al crear el conviviente", 500, []);
  }
};

/**
 * Actualiza un conviviente existente por su identificador.
 *
 * @async
 * @function
 * @param {string} id - Identificador del conviviente.
 * @param {Object} data - Datos a actualizar.
 * @returns {Promise<Object>} El conviviente actualizado.
 * @throws {AppError} Si ocurre un error al actualizar el conviviente.
 */
const updateCohabitant = async (id, data) => {
  try {
    const updated = await db.update(cohabitant).set(data).where(eq(cohabitant.id, id)).returning().get();
    return updated;
  } catch (error) {
    throw new AppError("Error al actualizar el conviviente", 500, []);
  }
};

export const cohabitantService = {
  getAllCohabitants,
  getCohabitantById,
  createCohabitant,
  updateCohabitant,
};

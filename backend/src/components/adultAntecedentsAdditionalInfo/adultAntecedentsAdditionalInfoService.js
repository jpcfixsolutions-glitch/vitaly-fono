import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { adultAntecedentsAdditionalInfo } from "./adultAntecedentsAdditionalInfoSchema.js";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";

/**
 * Obtiene todos los registros de antecedentes de adultos en el sistema.
 * 
 * @async
 * @function
 * @returns {Promise<Array>} Array con todos los registros.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getAll = async () => {
  try {
    const infoList = await db
      .select()
      .from(adultAntecedentsAdditionalInfo)
      .all();

    return infoList;
  } catch (error) {
    throw new AppError("Error al obtener los antecedentes de adultos.", 500, error);
  }
};

/**
 * Obtiene un registro de antecedentes de adultos por su ID principal.
 * 
 * @async
 * @function
 * @param {string} id - ID del registro a buscar.
 * @returns {Promise<Object|null>} Registro encontrado o null si no existe.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getById = async (id) => {
  try {
    const safeId = typeof id === 'string' ? id.trim() : String(id ?? '').trim();
    if (!safeId) {
      return null;
    }

    const foundInfo = await db
      .select()
      .from(adultAntecedentsAdditionalInfo)
      .where(eq(adultAntecedentsAdditionalInfo.id, safeId))
      .get();

    return foundInfo ?? null;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el registro de antecedentes.", 500, error);
  }
};

/**
 * Obtiene un registro de antecedentes de adultos por el ID de su entrevista asociada.
 * 
 * @async
 * @function
 * @param {string} id_interview - ID de la entrevista a buscar.
 * @returns {Promise<Object|null>} Registro encontrado o null si no existe.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getByInterviewId = async (id_interview) => {
  try {
    const safeId = typeof id_interview === 'string' ? id_interview.trim() : String(id_interview ?? '').trim();
    if (!safeId) {
      return null;
    }

    const foundInfo = await db
      .select()
      .from(adultAntecedentsAdditionalInfo)
      .where(eq(adultAntecedentsAdditionalInfo.id_interview, safeId))
      .get();

    return foundInfo ?? null;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los antecedentes por ID de entrevista.", 500, error);
  }
};

/**
 * Crea un nuevo registro de antecedentes de adultos.
 * 
 * @async
 * @function
 * @param {Object} dataInfo - Datos sanitizados a insertar.
 * @returns {Promise<Object>} Registro creado en la base de datos.
 * @throws {AppError} Si ocurre algún problema durante la creación.
 */
const create = async (dataInfo) => {
  try {
    const newInfo = {
      id: uuid(),
      ...dataInfo
    };

    const insertedInfo = await db
      .insert(adultAntecedentsAdditionalInfo)
      .values(newInfo)
      .returning()
      .get();

    return insertedInfo;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el registro de antecedentes de adultos.", 500, error);
  }
};

/**
 * Actualiza un registro de antecedentes de adultos existente por su ID.
 * 
 * @async
 * @function
 * @param {string} id - ID del registro que se desea actualizar.
 * @param {Object} dataInfo - Objeto con los datos limpios a actualizar.
 * @returns {Promise<Object>} Registro actualizado.
 * @throws {AppError} Si ocurre algún problema durante la actualización.
 */
const update = async (id, dataInfo) => {
  try {
    const updatedInfo = await db
      .update(adultAntecedentsAdditionalInfo)
      .set(dataInfo)
      .where(eq(adultAntecedentsAdditionalInfo.id, id))
      .returning()
      .get();

    return updatedInfo;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar los antecedentes de adultos.", 400, error);
  }
};

export const adultAntecedentsAdditionalInfoService = {
  getAll,
  getById,
  getByInterviewId,
  create,
  update
};
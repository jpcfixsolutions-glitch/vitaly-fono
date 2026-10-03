import { eq } from "drizzle-orm";
import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { documentType } from "./documentTypeSchema.js";
import { v4 as uuid } from "uuid";

/**
 * Obtiene todos los tipos de documento.
 *
 * @async
 * @function
 * @returns {Promise<Array>} Array con todos los tipos de documento encontrados.
 * @throws {AppError} Si ocurre un error al obtener los tipos de documento.
 */
const getAllDocumentTypes = async () => {
  try {
    const documentTypes = await db.select().from(documentType).all();
    return documentTypes;
  } catch (error) {
    throw new AppError("Error al obtener los tipos de documento", 500, []);
  }
}

/**
 * Obtiene un tipo de documento por su identificador.
 *
 * @async
 * @function
 * @param {string} id - Identificador del tipo de documento.
 * @returns {Promise<Object|null>} El tipo de documento encontrado o null si no existe.
 * @throws {AppError} Si ocurre un error al obtener el tipo de documento.
 */
const getDocumentTypeById = async (id) => {
  try {
    const documentTypeFound = await db.select().from(documentType).where(eq(documentType.id, id)).get();
    return documentTypeFound;
  } catch (error) {
    throw new AppError("Error al obtener el tipo de documento", 500, []);
  }
}

/**
 * Crea un nuevo tipo de documento.
 *
 * @async
 * @function
 * @param {Object} data - Datos del tipo de documento a crear.
 * @returns {Promise<Object>} El tipo de documento creado.
 * @throws {AppError} Si ocurre un error al crear el tipo de documento.
 */
const createDocumentType = async (data) => {
  try {
    const newDocumentType = {
      id: uuid(),
      ...data
    }
    const insertedDocumentType = await db.insert(documentType).values(newDocumentType).returning().get();
    return insertedDocumentType;
  } catch (error) {
    throw new AppError("Error al crear el tipo de documento", 500, []);
  }
}

export const documentTypeService = {
  getAllDocumentTypes,
  createDocumentType,
  getDocumentTypeById
}
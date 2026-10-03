import { v4 as uuid } from "uuid";
import db from "../../database/database.js";
import { archiveAttachment } from "./archiveAttachmentSchema.js";
import { eq, inArray } from "drizzle-orm";
import { AppError } from "../../../errors.js";

/**
 * Crea (registra) un nuevo archivo adjunto en la base de datos.
 * 
 * @param {Object} data - Datos del archivo (id, id_session, filename, etc.).
 * @returns {Promise<Object>} El archivo creado.
 */
const createArchiveAttachment = async (data) => {
  try {
    const toInsert = { id: uuid(), ...data };
    const inserted = await db.insert(archiveAttachment).values(toInsert).returning().get();
    return inserted;
  } catch (error) {
    throw new AppError("Error al registrar el archivo adjunto", 500, []);
  }
};

/**
 * Obtiene un archivo por su ID.
 * 
 * @param {string} id - ID del archivo.
 * @returns {Promise<Object>} El archivo encontrado.
 */
const getArchiveAttachmentById = async (id) => {
  try {
    const file = await db.select().from(archiveAttachment).where(eq(archiveAttachment.id, id)).get();
    return file;
  } catch (error) {
    throw new AppError("Error al obtener el archivo", 500, []);
  }
};

/**
 * Elimina un archivo de la base de datos por su ID.
 * 
 * @param {string} id - ID del archivo.
 * @returns {Promise<void>}
 */
const deleteArchiveAttachmentById = async (id) => {
  try {
    await db.delete(archiveAttachment).where(eq(archiveAttachment.id, id));
  } catch (error) {
    throw new AppError("Error al eliminar el archivo", 500, []);
  }
};

/**
 * Elimina múltiples archivos por IDs de sesión.
 * 
 * @param {Array<string>} sessionIds - IDs de sesiones.
 * @returns {Promise<void>}
 */
const deleteBySessionIds = async (sessionIds) => {
  try {
    if (sessionIds.length > 0) {
      await db.delete(archiveAttachment).where(inArray(archiveAttachment.id_session, sessionIds));
    }
  } catch (error) {
    throw new AppError("Error al eliminar archivos de las sesiones", 500, []);
  }
};

export const archiveAttachmentService = {
  createArchiveAttachment,
  getArchiveAttachmentById,
  deleteArchiveAttachmentById,
  deleteBySessionIds
};


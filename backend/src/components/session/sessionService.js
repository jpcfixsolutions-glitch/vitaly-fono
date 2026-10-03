import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { session } from "./sessionSchema.js";
import { v4 as uuid } from "uuid";
import { eq, sql } from "drizzle-orm";

/**
 * Obtiene todas las sesiones disponibles
 * 
 * @returns {Promise<Array>} Array con todas las sesiones encontradas
 * @returns {string} returns.id - ID de la sesión
 * @returns {string} returns.id_patient - ID del paciente asociado
 * @returns {string} returns.id_user - ID del usuario (psicóloga)
 * @returns {string} returns.id_service - ID del servicio asociado
 * @returns {string} returns.id_turn - ID del turno (si aplica)
 * @returns {string} returns.session_date - Fecha de la sesión
 * @returns {string} returns.clinical_notes - Notas clínicas de la sesión
 * @returns {string} returns.status - Estado de la sesión
 * @returns {string} returns.created_at - Fecha de creación
 * @returns {string} returns.updated_at - Fecha de última actualización
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */

const getAllSessions = async () => {
    try {
        const sessions = await db.select().from(session).all();
        return sessions;
    } catch (error) {
        throw new AppError("Ocurrió un error al obtener las sesiones.", 400, []);
    }
};

/**
 * Obtiene una sesión específica por su ID
 * 
 * @param {string} id - ID de la sesión a buscar
 * @returns {Promise<Object>} La sesión encontrada
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */

const getSessionById = async (id) => {
    try {
        const sessionFound = await db.select().from(session).where(eq(session.id, id)).get();
        return sessionFound;
    } catch (error) {
        throw new AppError("Ocurrió un error al obtener la sesión", 400, []);
    }
};

const getSessionByTurnId = async (id, database = db) => {
    try {
        const sessionFound = await database.select().from(session).where(eq(session.id_turn, id)).get();
        return sessionFound;
    } catch (error) {
        throw new AppError("Ocurrió un error al obtener la sesión por turno.", 400, []);
    }
};

/**
 * Crea una nueva sesión en la base de datos
 * 
 * @param {Object} dataSession - Datos de la sesión a crear
 * @param {string} dataSession.id_patient - ID del paciente asociado
 * @param {string} dataSession.id_user - ID del usuario (psicóloga)
 * @param {string|null} [dataSession.id_service] - ID del servicio asociado, si ya fue seleccionado
 * @param {string} [dataSession.id_turn] - ID del turno (opcional)
 * @param {string} dataSession.session_date - Fecha de la sesión
 * @param {string} [dataSession.clinical_notes] - Notas clínicas (opcional)
 * @param {string} dataSession.status - Estado de la sesión
 * @param {string} dataSession.created_at - Fecha de creación
 * @param {string} dataSession.updated_at - Fecha de última actualización
 * @returns {Promise<Object>} La sesión creada
 * @throws {AppError} Si ocurre un error al crear la sesión
 */

const createSession = async (dataSession, database = db) => {
    try {
        const newSession = {
            id: uuid(),
            ...dataSession
        };
        const insertedSession = await database.insert(session).values(newSession).returning().get();
        return insertedSession;
    } catch (error) {
        throw new AppError("Ocurrió un error al crear la sesión.", 400, []);
    }
};

/**
 * Actualiza una sesión existente en la base de datos
 * 
 * @param {string} id - ID de la sesión a actualizar
 * @param {Object} dataSession - Datos actualizados de la sesión
 * @returns {Promise<Object>} La sesión actualizada
 * @throws {AppError} Si ocurre un error al actualizar la sesión
 */

const updateSession = async (id, dataSession) => {
    try {
        const updatedSession = await db
            .update(session)
            .set(dataSession)
            .where(eq(session.id, id))
            .returning()
            .get();
        return updatedSession;
    } catch (error) {
        throw new AppError("Ocurrió un error al actualizar la sesión.", 400, []);
    }
};


/**
 * Elimina una sesión de forma permanente de la base de datos
 *
 * @param {string} id - ID de la sesión a eliminar
 * @returns {Promise<void>}
 * @throws {AppError} Si ocurre un error al eliminar la sesión
 */
const deleteSession = async (id, database = db) => {
    try {
        await database.delete(session).where(eq(session.id, id));
        return;
    } catch (error) {
        throw new AppError("Ocurrió un error al eliminar la sesión.", 400, []);
    }
};


export const sessionService = {
    getAllSessions,
    getSessionById,
    getSessionByTurnId,
    createSession,
    updateSession,
    deleteSession,
};

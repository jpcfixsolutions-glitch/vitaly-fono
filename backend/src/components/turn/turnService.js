import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { turns } from "./turnSchema.js";
import { eq, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { user } from "../user/userSchema.js";

/**
 * Obtiene todos los turnos de la base de datos.
 * 
 * @description Recupera todos los turnos almacenados en la tabla turnos.
 * 
 * @returns {Promise<Array>} Array con todos los turnos encontrados.
 * 
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getAllTurns = async () => {
  try {
    const allTurns = await db
      .select({
        id: turns.id,
        name: turns.name,
        last_name: turns.last_name,
        phone: turns.phone,
        modality: turns.modality,
        date: turns.date,
        id_document_type: turns.id_document_type,
        document_number: turns.document_number,
        new_patient: turns.new_patient,
        status: turns.status,
        id_user: turns.id_user,
        created_at: turns.created_at,
        updated_at: turns.updated_at,
        psychologist_name: sql`trim(${user.name} || ' ' || ${user.last_name})`.as("psychologist_name"),
      })
      .from(turns)
      .leftJoin(user, eq(turns.id_user, user.id))
      .all();

    return allTurns.map((turn) => ({
      ...turn,
      psychologist_name: turn.psychologist_name?.trim() ? turn.psychologist_name : "Sin asignar",
    }));
  } catch (error) {
    throw new AppError("Error al obtener los turnos", 400, []);
  }
};

/**
 * Obtiene un turno específico por su ID.
 * 
 * @description Busca un turno en la base de datos usando su identificador único.
 * 
 * @param {string} id - ID único del turno a buscar.
 * 
 * @returns {Promise<Object|null>} El turno encontrado o null si no existe.
 * 
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getTurnById = async (id) => {
  try {
    const turn = await db.select().from(turns).where(eq(turns.id, id)).get();
    return turn;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el turno", 400, []);
  }
};

/**
 * Crea un nuevo turno en la base de datos.
 * 
 * @description Inserta un nuevo turno con los datos proporcionados y genera un ID único.
 * 
 * @param {Object} turnoData - Datos del turno a crear.
 * @param {string} turnoData.name - Nombre de la persona.
 * @param {string} turnoData.last_name - Apellido de la persona.
 * @param {string} turnoData.phone - Teléfono de contacto.
 * @param {string} turnoData.modality - Modalidad del turno.
 * @param {string} turnoData.date - Fecha del turno.
 * 
 * @returns {Promise<Object>} El turno creado con su ID asignado.
 * 
 * @throws {AppError} Si ocurre un error al insertar en la base de datos.
 */
const createTurn = async (turnData) => {
  try {
    const newTurn = {
      id: uuid(),
      ...turnData
    };
    const insertedTurno = await db.insert(turns).values(newTurn).returning().get();
    return insertedTurno;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el turno", 400, []);
  }
};

/**
 * Actualiza un turno existente en la base de datos.
 * 
 * @description Modifica los datos de un turno específico usando su ID.
 * 
 * @param {string} id - ID del turno a actualizar.
 * @param {Object} turnData - Datos actualizados del turno.
 * 
 * @returns {Promise<Object>} El turno actualizado.
 * 
 * @throws {AppError} Si ocurre un error al actualizar en la base de datos.
 */
const updateTurn = async (id, turnData, database = db) => {
  try {
    const updatedTurn = await database
      .update(turns)
      .set({ ...turnData })
      .where(eq(turns.id, id))
      .returning()
      .get();
    return updatedTurn;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar el turno", 400, []);
  }
};

/**
 * Elimina un turno de la base de datos.
 * 
 * @description Borra permanentemente un turno usando su ID.
 * 
 * @param {string} id - ID del turno a eliminar.
 * 
 * @returns {Promise<void>} No retorna datos, solo confirma la eliminación.
 * 
 * @throws {AppError} Si ocurre un error al eliminar de la base de datos.
 */
const deleteTurn = async (id) => {
  try {
    await db.delete(turns).where(eq(turns.id, id));
    return;
  } catch (error) {
    throw new AppError("Ocurrió un error al eliminar el turno", 400, []);
  }
};

/**
 * Obtiene los turnos pendientes de un usuario (fecha futura y estado Activo)
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Array de turnos pendientes
 */
const getPendingTurnsByUserId = async (userId) => {
  try {
    const now = new Date().toISOString();
    const pending = await db
      .select()
      .from(turns)
      .where(
        eq(turns.status, "Activo"),
        eq(turns.id_user, userId),
        sql`${turns.date} >= ${now}`
      )
      .all();
    return pending;
  } catch (error) {
    throw new AppError("Ocurrió un error al buscar turnos pendientes por usuario", 500, []);
  }
};


export const turnService = {
  getAllTurns,
  getTurnById,
  createTurn,
  updateTurn,
  deleteTurn,
  getPendingTurnsByUserId,
};

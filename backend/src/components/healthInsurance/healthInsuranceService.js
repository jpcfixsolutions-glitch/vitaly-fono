import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { healthInsurance } from "./healthInsuranceSchema.js";

import { v4 as uuid } from "uuid";

import { eq, sql, and } from "drizzle-orm";


/**
 * Obtiene todas las obras sociales disponibles
 * 
 * @returns {Promise<Array>} Array con todas las obras sociales encontradas
 * @returns {string} returns.id - ID de la obra social encontrada
 * @returns {string} returns.name - Nombre de la obra social encontrada
 * @returns {string} returns.status - Estado de la obra social encontrada
 * @returns {string} returns.created_at - Fecha de creación de la obra social encontrada
 * @returns {string} returns.updated_at - Fecha de actualización de la obra social encontrada
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getAllHealthInsurances = async () => {
  try {
    const healthInsurances = await db.select().from(healthInsurance).all();
    return healthInsurances;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener las obras sociales.", 500, []);
  }
};


/**
 * Obtiene una obra social específica por su ID
 * 
 * @param {string} id - ID de la obra social a buscar
 * @returns {Promise<Object>} La obra social encontrada
 * @returns {string} returns.id - ID de la obra social encontrada
 * @returns {string} returns.name - Nombre de la obra social encontrada
 * @returns {string} returns.status - Estado de la obra social encontrada
 * @returns {string} returns.created_at - Fecha de creación de la obra social encontrada
 * @returns {string} returns.updated_at - Fecha de actualización de la obra social encontrada
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getHealthInsuranceById = async (id) => {
  try {
    const healthInsuranceFound = await db.select().from(healthInsurance).where(eq(healthInsurance.id, id)).get();
    return healthInsuranceFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener la obra social.", 500, []);
  }
};


/**
 * Obtiene todas las obras sociales disponibles por nombre
 * 
 * @param {string} name - Nombre de la obra social a buscar
 * @returns {Promise<Array>} Array con todas las obras sociales que coincidan con el nombre
 * @returns {string} returns.id - ID de la obra social encontrada
 * @returns {string} returns.name - Nombre de la obra social encontrada
 * @returns {string} returns.status - Estado de la obra social encontrada
 * @returns {string} returns.id_user - ID del usuario que creó la obra social encontrada
 * @returns {string} returns.created_at - Fecha de creación de la obra social encontrada
 * @returns {string} returns.updated_at - Fecha de actualización de la obra social encontrada
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getHealthInsurancesByName = async (name, id_user) => {
  try {
    const healthInsuranceFound = await db.select().from(healthInsurance).where(and(eq(sql`LOWER(${healthInsurance.name})`, sql`LOWER(${name})`), eq(healthInsurance.id_user, id_user))).get();
    return healthInsuranceFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al validar la existencia de la obra social.", 500, []);
  }
};


/**
 * Crea una nueva obra social en la base de datos
 * 
 * @param {Object} data - Datos de la obra social a crear
 * @param {string} data.name - Nombre de la obra social
 * @returns {Promise<Object>} La obra social creada
 * @returns {string} returns.id - ID de la obra social creada
 * @returns {string} returns.name - Nombre de la obra social creada
 * @returns {string} returns.status - Estado de la obra social creada
 * @returns {string} returns.created_at - Fecha de creación de la obra social creada
 * @returns {string} returns.updated_at - Fecha de actualización de la obra social creada
 * @throws {AppError} Si ocurre un error al crear la obra social
 */
const createHealthInsurance = async (data) => {
  try {
    const newHealthInsurance = {
      id: uuid(),
      ...data
    };
    const insertedHealthInsurance = await db.insert(healthInsurance).values(newHealthInsurance).returning().get();
    return insertedHealthInsurance;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear la obra social.", 500, []);
  }
};

/**
 * Actualiza una obra social en la base de datos por su ID
 * 
 * @param {string} id - ID de la obra social a actualizar
 * @param {Object} data - Datos de la obra social a actualizar
 * @param {string} data.name - Nombre de la obra social
 * @returns {Promise<Object>} La obra social actualizada
 * @returns {string} returns.id - ID de la obra social actualizada
 * @returns {string} returns.name - Nombre de la obra social actualizada
 * @returns {string} returns.status - Estado de la obra social actualizada
 * @returns {string} returns.created_at - Fecha de creación de la obra social actualizada
 * @returns {string} returns.updated_at - Fecha de actualización de la obra social actualizada
 * @throws {AppError} Si ocurre un error al actualizar la obra social
 */
const updateHealthInsurance = async (id, data) => {
  try {
    const updatedHealthInsurance = await db.update(healthInsurance).set(data).where(eq(healthInsurance.id, id)).returning().get();
    return updatedHealthInsurance;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar la obra social.", 500, []);
  }
};

/**
 * Da de baja una obra social en la base de datos por su ID
 * 
 * @param {string} id - ID de la obra social a dar de baja
 * @returns {Promise<Object>} La obra social dada de baja
 * @returns {string} returns.id - ID de la obra social dada de baja
 * @returns {string} returns.name - Nombre de la obra social dada de baja
 * @returns {string} returns.status - Estado de la obra social dada de baja
 * @returns {string} returns.created_at - Fecha de creación de la obra social dada de baja
 * @returns {string} returns.updated_at - Fecha de actualización de la obra social dada de baja
 * @throws {AppError} Si ocurre un error al dar de baja la obra social
 */
const deactivateHealthInsurance = async (id) => {
  try {
    const healthInsuranceUpdated = await db.update(healthInsurance).set({ status: "Inactivo" }).where(eq(healthInsurance.id, id)).returning().get();
    return healthInsuranceUpdated;
  } catch (error) {
    throw new AppError("Ocurrió un error al dar de baja la obra social.", 500, []);
  }
};


export const healthInsuranceService = {
  getAllHealthInsurances,
  getHealthInsuranceById,
  getHealthInsurancesByName,
  createHealthInsurance,
  updateHealthInsurance,
  deactivateHealthInsurance
};
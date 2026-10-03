import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { paymentMethod } from "./paymentMethodSchema.js";
import { v4 as uuid } from "uuid";
import { eq, sql, and } from "drizzle-orm";

/**
 * Obtiene todos los métodos de pago disponibles
 * 
 * @returns {Promise<Array>} Array con todos los métodos de pago encontrados
 * @returns {string} returns.id - ID del método de pago encontrado
 * @returns {string} returns.name - Nombre del método de pago encontrado
 * @returns {string} returns.status - Estado del método de pago encontrado
 * @returns {string} returns.created_at - Fecha de creación del método de pago encontrado
 * @returns {string} returns.updated_at - Fecha de actualización del método de pago encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getAllPaymentMethods = async () => {
  try {
    const paymentMethods = await db.select().from(paymentMethod).all();
    return paymentMethods;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los métodos de pago.", 500, []);
  }
}

/**
 * Obtiene un método de pago específico por su ID
 * 
 * @param {string} id - ID del método de pago a buscar
 * @returns {Promise<Object>} El método de pago encontrado
 * @returns {string} returns.id - ID del método de pago encontrado
 * @returns {string} returns.name - Nombre del método de pago encontrado
 * @returns {string} returns.status - Estado del método de pago encontrado
 * @returns {string} returns.created_at - Fecha de creación del método de pago encontrado
 * @returns {string} returns.updated_at - Fecha de actualización del método de pago encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPaymentMethodById = async (id) => {
  try {
    const paymentMethodFound = await db.select().from(paymentMethod).where(eq(paymentMethod.id, id)).get();
    return paymentMethodFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el método de pago.", 500, []);
  }
}

/**
 * Obtiene un método de pago específico por su nombre
 * 
 * @param {string} name - Nombre del método de pago a buscar
 * @returns {Promise<Object>} El método de pago encontrado
 * @returns {string} returns.id - ID del método de pago encontrado
 * @returns {string} returns.name - Nombre del método de pago encontrado
 * @returns {string} returns.status - Estado del método de pago encontrado
 * @returns {string} returns.id_user - ID del usuario que creó el método de pago encontrado
 * @returns {string} returns.created_at - Fecha de creación del método de pago encontrado
 * @returns {string} returns.updated_at - Fecha de actualización del método de pago encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPaymentMethodByName = async (name, id_user) => {
  try {
    const paymentMethodFound = await db.select().from(paymentMethod).where(and(eq(sql`LOWER(${paymentMethod.name})`, sql`LOWER(${name})`), eq(paymentMethod.id_user, id_user))).get();
    return paymentMethodFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el método de pago.", 500, []);
  }
}

/**
 * Crea un nuevo método de pago en la base de datos
 * 
 * @param {Object} dataPaymentMethod - Datos del método de pago a crear
 * @param {string} dataPaymentMethod.name - Nombre del método de pago
 * @returns {Promise<Object>} El método de pago creado con su ID generado
 * @returns {string} returns.id - ID único generado automáticamente
 * @returns {string} returns.status - Estado del método de pago
 * @returns {string} returns.created_at - Fecha de creación del método de pago
 * @returns {string} returns.updated_at - Fecha de actualización del método de pago
 * @throws {AppError} Si ocurre un error al crear el método de pago
 */
const createPaymentMethod = async (dataPaymentMethod) => {
  try {
    const newPaymentMethod = {
      id: uuid(),
      ...dataPaymentMethod
    };
    const insertedPaymentMethod = await db.insert(paymentMethod).values(newPaymentMethod).returning().get();
    return insertedPaymentMethod;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el método de pago.", 500, []);
  }
}

/**
 * Actualiza un método de pago en la base de datos
 * 
 * @param {string} id - ID del método de pago a actualizar
 * @param {Object} dataPaymentMethod - Datos del método de pago a actualizar
 * @param {string} dataPaymentMethod.name - Nombre del método de pago
 * @returns {Promise<Object>} El método de pago actualizado
 * @throws {AppError} Si ocurre un error al actualizar el método de pago
 */
const updatePaymentMethod = async (id, dataPaymentMethod) => {
  try {
    const updatedPaymentMethod = await db.update(paymentMethod).set(dataPaymentMethod).where(eq(paymentMethod.id, id)).returning().get();
    return updatedPaymentMethod;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar el método de pago.", 500, []);
  }
}

/**
 * Da de baja un método de pago en la base de datos
 * 
 * @param {string} id - ID del método de pago a dar de baja
 * @returns {Promise<Object>} El método de pago dado de baja
 * @returns {string} returns.id - ID del método de pago dado de baja
 * @returns {string} returns.name - Nombre del método de pago dado de baja
 * @returns {string} returns.status - Estado del método de pago dado de baja
 * @returns {string} returns.created_at - Fecha de creación del método de pago dado de baja
 * @returns {string} returns.updated_at - Fecha de actualización del método de pago dado de baja
 * @throws {AppError} Si ocurre un error al dar de baja el método de pago
 */
const deactivatePaymentMethod = async (id) => {
  try {
    const paymentMethodUpdated = await db.update(paymentMethod)
      .set({ status: "Inactivo" })
      .where(eq(paymentMethod.id, id))
      .returning().get();
    return paymentMethodUpdated;
  } catch (error) {
    throw new AppError("Ocurrió un error al dar de baja el método de pago.", 500, []);
  }
}

export const paymentMethodService = {
  getAllPaymentMethods,
  getPaymentMethodById,
  getPaymentMethodByName,
  createPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod
};
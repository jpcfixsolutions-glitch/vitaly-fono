import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { paymentHistory } from "./paymentHistorySchema.js";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { session } from "../session/sessionSchema.js";
import { patient } from "../patient/patientSchema.js";
import { healthInsurance } from "../healthInsurance/healthInsuranceSchema.js";
import { paymentMethod } from "../paymentMethod/paymentMethodSchema.js";
import { typeServiceTable } from "../typeService/typeServiceSchema.js";
import { getCurrentDate } from "../../utils/date.js";
import { user } from "../user/userSchema.js";

/**
 * Obtiene todo el historial de cobros realizados en el sistema con detalles relacionados.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} Retorna un array con todos los registros del historial de cobros, incluyendo datos de sesión, paciente, obra social, método de pago y servicio.
 * @throws {AppError} Cuando ocurre un error al consultar la base de datos.
 */
const getAllPaymentHistory = async () => {
  try {
    const rows = await db.select({
      id: paymentHistory.id,
      id_user: paymentHistory.id_user,
      id_session: paymentHistory.id_session,
      id_patient: paymentHistory.id_patient,
      id_health_insurance: paymentHistory.id_health_insurance,
      id_payment_method: paymentHistory.id_payment_method,
      id_service: paymentHistory.id_service,
      amount: paymentHistory.amount,
      paid_at: paymentHistory.paid_at,
      status: paymentHistory.status,
      notes: paymentHistory.notes,
      created_at: paymentHistory.created_at,
      updated_at: paymentHistory.updated_at,
      session_date: session.session_date,
      patient_name: patient.name,
      patient_last_name: patient.last_name,
      health_insurance_name: healthInsurance.name,
      payment_method_name: paymentMethod.name,
      service_name: typeServiceTable.name,
    })
      .from(paymentHistory)
      .leftJoin(session, eq(paymentHistory.id_session, session.id))
      .leftJoin(patient, eq(paymentHistory.id_patient, patient.id))
      .leftJoin(healthInsurance, eq(paymentHistory.id_health_insurance, healthInsurance.id))
      .leftJoin(paymentMethod, eq(paymentHistory.id_payment_method, paymentMethod.id))
      .leftJoin(typeServiceTable, eq(paymentHistory.id_service, typeServiceTable.id))
      .leftJoin(user, eq(paymentHistory.id_user, user.id))
      .all();
    return rows;
  } catch (error) {
    throw new AppError("Ocurrió un error del servidor al obtener el historial de cobros.", 500, []);
  }
};

/**
 * Obtiene un registro de cobro específico por su ID.
 *
 * @async
 * @function
 * @param {string} id - El ID del registro de cobro a obtener.
 * @returns {Promise<Object|null>} Retorna el registro de cobro si existe, o null si no se encuentra.
 * @throws {AppError} Cuando ocurre un error al consultar la base de datos.
 */
const getPaymentHistoryById = async (id) => {
  try {
    const row = await db.select().from(paymentHistory).where(eq(paymentHistory.id, id)).get();
    return row;
  } catch (error) {
    throw new AppError("Ocurrió un error del servidor al obtener el cobro.", 500, []);
  }
};

/**
 * Crea un nuevo registro en el historial de pagos.
 *
 * @async
 * @function
 * @param {Object} data - Los datos del nuevo cobro a registrar.
 * @param {string} data.id_session - ID de la sesión asociada al cobro.
 * @param {string} data.id_patient - ID del paciente.
 * @param {string} data.id_health_insurance - ID de la obra social.
 * @param {string} data.id_payment_method - ID del método de pago.
 * @param {string} data.id_service - ID del servicio.
 * @param {number} data.amount - Monto cobrado.
 * @param {string} [data.notes] - Notas opcionales.
 * @param {string} [data.id_user] - ID del usuario que registra el cobro.
 * @param {string} data.created_at - Fecha de creación.
 * @param {string} data.updated_at - Fecha de última actualización.
 * @param {string} data.paid_at - Fecha de pago.
 * @param {string} data.status - Estado del cobro ("Pagada", etc).
 * @returns {Promise<Object>} Retorna el nuevo registro insertado.
 * @throws {AppError} Cuando ocurre un error al registrar el cobro.
 */
const createPaymentHistory = async (data) => {
  try {
    const newRow = {
      id: uuid(),
      ...data,
    };
    const inserted = await db.insert(paymentHistory).values(newRow).returning().get();
    return inserted;
  } catch (error) {
    throw new AppError("Ocurrió un error del servidor al crear el cobro.", 500, []);
  }
};

/**
 * Anula (cambia el estado a "Anulado") un registro de cobro del historial.
 *
 * @async
 * @function
 * @param {string} id - El ID del cobro a anular.
 * @returns {Promise<Object>} Retorna el registro actualizado después de anular.
 * @throws {AppError} Cuando ocurre un error al actualizar el cobro.
 */
const deactivatePaymentHistory = async (id) => {
  try {
    const now = getCurrentDate();
    const updated = await db
      .update(paymentHistory)
      .set({ status: "Anulado", updated_at: now })
      .where(eq(paymentHistory.id, id))
      .returning()
      .get();
    return updated;
  } catch (error) {
    throw new AppError("Ocurrió un error del servidor al anular el cobro.", 500, []);
  }
};

export const paymentHistoryService = {
  getAllPaymentHistory,
  getPaymentHistoryById,
  createPaymentHistory,
  deactivatePaymentHistory,
};



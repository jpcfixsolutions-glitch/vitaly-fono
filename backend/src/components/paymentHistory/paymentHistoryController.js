import { paymentHistoryService } from "./paymentHistoryService.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { sessionService } from "../session/sessionService.js";
import { paymentHistoryValidations } from "./paymentHistoryValidations.js";
import { paymentHistorySanitized } from "./paymentHistorySanitized.js";

/**
 * Obtiene todo el historial de cobros realizados en el sistema.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con la lista del historial de cobros o un mensaje de error.
 */
const getAllPaymentHistory = async (req, res) => {
  try {
    const items = await paymentHistoryService.getAllPaymentHistory();

    if (!items || items.length === 0) {
      return sendError(res, 404, "No se encontraron registros de cobros", []);
    }

    return sendSuccess(res, "Historial de cobros obtenido correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un cobro del historial por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con el cobro encontrado o un mensaje de error.
 */
const getPaymentHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await paymentHistoryService.getPaymentHistoryById(id);

    if (!item) {
      return sendError(res, 404, "No se encontró el cobro buscado", []);
    }

    return sendSuccess(res, "Cobro obtenido correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo registro de cobro (historial de pagos).
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con el cobro creado o un mensaje de error.
 */
const createPaymentHistory = async (req, res) => {
  try {
    const { id_session, id_patient, id_health_insurance, id_payment_method, id_service, amount, notes, id_user } = req.body;

    await paymentHistoryValidations(id_session, id_patient, id_health_insurance, id_payment_method, id_service, amount, notes, id_user);

    const { objectSanitized } = paymentHistorySanitized(id_session, id_patient, id_health_insurance, id_payment_method, id_service, amount, notes, id_user);

    const result = await paymentHistoryService.createPaymentHistory(objectSanitized);

    if (result) {
      const updatedSession = await sessionService.updateSession(id_session, { status: "Pagada" });
      if (!updatedSession) {
        return sendError(res, 400, "No se pudo actualizar el estado de la sesión", []);
      }
    }

    return sendSuccess(res, "Cobro registrado correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Anula (desactiva) un registro de cobro en el historial.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con el cobro anulado o un mensaje de error.
 */
const deactivatePaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await paymentHistoryService.getPaymentHistoryById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el cobro", []);
    }

    const sessionExists = await sessionService.getSessionById(exists.id_session);
    if (!sessionExists) {
      return sendError(res, 404, "No se encontró la sesión", []);
    }

    const updated = await paymentHistoryService.deactivatePaymentHistory(id);

    if (updated && exists.id_session && sessionExists.clinical_notes === "") {
      const sessionUpdated = await sessionService.updateSession(exists.id_session, { status: "Creada" });
      if (!sessionUpdated) {
        return sendError(res, 400, "Se anuló el cobro pero no se pudo actualizar el estado de la sesión", []);
      }
    }

    if (updated && exists.id_session && sessionExists.clinical_notes !== "") {
      const sessionUpdated = await sessionService.updateSession(exists.id_session, { status: "Completada" });

      if (!sessionUpdated) {
        return sendError(res, 400, "Se anuló el cobro pero no se pudo actualizar el estado de la sesión", []);
      }
    }

    return sendSuccess(res, "Cobro anulado correctamente", updated);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export const paymentHistoryController = {
  getAllPaymentHistory,
  getPaymentHistoryById,
  createPaymentHistory,
  deactivatePaymentHistory
};



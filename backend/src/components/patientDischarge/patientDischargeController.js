import { patientDischargeService } from "./patientDischargeService.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { patientDischargeValidations } from "./patientDischargeValidations.js";
import { patientDischargeSanitized } from "./patientDischargeSanitized.js";
import { patientService } from "../patient/patientService.js";
import { getCurrentDate } from "../../utils/date.js";

/**
 * Obtiene todos los cierres de tratamiento registrados.
 * 
 * @function
 * @async
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getAllPatientDischarges = async (req, res) => {
  try {
    const patientDischarges = await patientDischargeService.getAllPatientDischarges();

    if (!patientDischarges || patientDischarges.length === 0) {
      return sendError(res, 404, "No se encontraron cierres de tratamiento registrados", []);
    }

    return sendSuccess(res, "Cierres de tratamiento obtenidos correctamente", patientDischarges);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un cierre de tratamiento por su ID.
 * 
 * @function
 * @async
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getPatientDischargeById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientDischarge = await patientDischargeService.getPatientDischargeById(id);

    if (!patientDischarge) {
      return sendError(res, 404, "No se encontró el cierre de tratamiento buscado", []);
    }

    return sendSuccess(res, "Cierre de tratamiento obtenido correctamente", patientDischarge);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo cierre de tratamiento para un paciente.
 * 
 * @function
 * @async
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const createPatientDischarge = async (req, res) => {
  try {
    const { id_patient, type, closing_reason } = req.body;

    await patientDischargeValidations(id_patient, type, closing_reason);

    if (type === 'Reactivación del tratamiento') {
      await patientService.updatePatient(id_patient, { status: 'Activo', updated_at: getCurrentDate() });
    } else {
      await patientService.deactivatePatient(id_patient);
    }

    const { objectSanitized } = patientDischargeSanitized(id_patient, type, closing_reason);

    const result = await patientDischargeService.createPatientDischarge(objectSanitized);
    return sendSuccess(res, "Cierre de tratamiento creado correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const patientDischargeController = {
  getAllPatientDischarges,
  getPatientDischargeById,
  createPatientDischarge,
};

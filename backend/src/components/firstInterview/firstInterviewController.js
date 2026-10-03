import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { firstInterviewService } from "./firstInterviewService.js";
import { getCurrentDate } from "../../utils/date.js";
import { firstInterviewSanitized } from "./firstInterviewSanitized.js";
import { firstInterviewValidations } from "./firstInterviewValidations.js";
import { updatePatientData } from "./utils.js";

/**
 * Obtiene todas las primeras entrevistas.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getAllFirstInterviews = async (req, res) => {
  try {
    const items = await firstInterviewService.getAllFirstInterviews();
    if (!items || items.length === 0) {
      return sendError(res, 404, "No se encontraron registros de primeras entrevistas", []);
    }
    return sendSuccess(res, "Primeras entrevistas obtenidas correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene una primera entrevista por su identificador.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getFirstInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await firstInterviewService.getFirstInterviewById(id);
    if (!item) {
      return sendError(res, 404, "No se encontró la primera entrevista buscada", []);
    }
    return sendSuccess(res, "Primera entrevista obtenida correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene una primera entrevista por el identificador del paciente.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getFirstInterviewByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const item = await firstInterviewService.getFirstInterviewDetailsByPatientId(patientId);
    if (!item) {
      return sendError(res, 404, "El paciente no registra primera entrevista", []);
    }
    return sendSuccess(res, "Primera entrevista del paciente obtenida correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Obtiene todas las primeras entrevistas por el identificador del usuario.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getAllFirstInterviewsByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;
    const items = await firstInterviewService.getAllFirstInterviewsByUserId(id_user);
    if (!items || items.length === 0) {
      return sendError(res, 404, "No se encontraron registros de primeras entrevistas", []);
    }
    return sendSuccess(res, "Primeras entrevistas obtenidas correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Crea una nueva primera entrevista.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const createFirstInterview = async (req, res) => {
  try {
    const {
      id_patient,
      id_user,
      patient,
      interview,
      family,
      cohabitants,
      schooling,
      adultAntecedentsAdditionalInfo
    } = req.body;

    // Validaciones básicas (existencia de usuario y paciente)
    await firstInterviewValidations(
      id_patient, 
      id_user
    );

    // Sanitización de los datos de la entrevista principal
    // Nota: Mantenemos la lógica de sanitización existente para la entrevista
    const { objectSanitized: interviewSanitized } = firstInterviewSanitized(
      id_patient, 
      id_user, 
      interview?.family_dynamics, 
      interview?.perinatal_history, 
      interview?.general_development, 
      interview?.diseases_allergies, 
      interview?.family_pathology_history, 
      interview?.personality_description, 
      interview?.reason_for_consultation, 
      interview?.genogram, 
      "create"
    );

    // Construcción del objeto completo para el servicio transaccional
    const fullData = {
      interview: interviewSanitized,
      patient: patient,
      family: family,
      cohabitants: cohabitants,
      schooling: schooling,
      adultAntecedentsAdditionalInfo: adultAntecedentsAdditionalInfo
    };

    const result = await firstInterviewService.createFirstInterview(fullData);

    return sendSuccess(res, "Primera entrevista registrada correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Actualiza una primera entrevista existente.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const updateFirstInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await firstInterviewService.getFirstInterviewById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró la primera entrevista", []);
    }

    const {
      id_patient,
      id_user,
      patient,
      interview,
      family,
      cohabitants,
      schooling,
      adultAntecedentsAdditionalInfo
    } = req.body;

    const { objectSanitized: interviewSanitized } = firstInterviewSanitized(
      id_patient || exists.id_patient, 
      id_user || exists.id_user, 
      interview?.family_dynamics, 
      interview?.perinatal_history, 
      interview?.general_development, 
      interview?.diseases_allergies, 
      interview?.family_pathology_history, 
      interview?.personality_description, 
      interview?.reason_for_consultation, 
      interview?.genogram, 
      "update"
    );

    // Si viene fecha, la agregamos (el sanitized ya maneja 'date' si se pasa como argumento, pero aquí lo forzamos si viene en interview object)
    if (interview?.date) {
      interviewSanitized.date = interview.date;
    }

    // 2. Construcción del objeto fullData
    const fullData = {
      interview: interviewSanitized,
      patient: patient,
      family: family,
      cohabitants: cohabitants,
      schooling: schooling,
      adultAntecedentsAdditionalInfo: adultAntecedentsAdditionalInfo
    };

    const updated = await firstInterviewService.updateFirstInterview(id, fullData);
    return sendSuccess(res, "Primera entrevista actualizada correctamente", updated);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const firstInterviewController = {
  getAllFirstInterviews,
  getFirstInterviewById,
  getFirstInterviewByPatientId,
  getAllFirstInterviewsByUserId,
  createFirstInterview,
  updateFirstInterview
};

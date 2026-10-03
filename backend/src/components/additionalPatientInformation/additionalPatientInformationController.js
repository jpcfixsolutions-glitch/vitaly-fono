import { additionalPatientInformationService } from "./additionalPatientInformationService.js";
import { patientService } from "../patient/patientService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { additionalPatientInformationValidations } from "./additionalPatientInformationValidations.js";
import { additionalPatientInformationSanitized } from "./additionalPatientInformationSanitized.js";

/**
 * Obtiene toda la información adicional de los pacientes registrada en el sistema.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getAllAdditionalPatientInformation = async (req, res) => {
  try {
    const infoList = await additionalPatientInformationService.getAll();

    if (!infoList || infoList.length === 0) {
      return sendError(res, 404, "No se encontró información adicional registrada", []);
    }

    return sendSuccess(res, "Información adicional obtenida correctamente", infoList);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un registro de información adicional por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getAdditionalPatientInformationById = async (req, res) => {
  try {
    const { id } = req.params;

    const additionalInfo = await additionalPatientInformationService.getById(id);

    if (!additionalInfo) {
      return sendError(res, 404, "No se encontró el registro de información adicional buscado", []);
    }

    return sendSuccess(res, "Información adicional obtenida correctamente", additionalInfo);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo registro de información adicional asociado a una entrevista.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const createAdditionalPatientInformation = async (req, res) => {
  try {
    const {
      id_interview,
      civil_status,
      second_phone,
      living_with,
      profession,
      derivation,
      has_had_therapy,
      therapy_duration,
      reason_for_leaving_therapy,
      current_therapy_type
    } = req.body;

    // 1. Verificar que no exista ya información adicional para esta entrevista (relación 1 a 1)
    const infoExists = await additionalPatientInformationService.getByInterviewId(id_interview);
    if (infoExists) {
      return sendError(res, 400, "Ya existe información adicional registrada para esta entrevista", []);
    }

    // 2. Validaciones específicas
    await additionalPatientInformationValidations(
      id_interview,
      civil_status,
      second_phone,
      living_with,
      profession,
      derivation,
      has_had_therapy,
      therapy_duration,
      reason_for_leaving_therapy,
      current_therapy_type
    );

    // 3. Sanitización
    const { objectSanitized } = additionalPatientInformationSanitized(
      id_interview,
      civil_status,
      second_phone,
      living_with,
      profession,
      derivation,
      has_had_therapy,
      therapy_duration,
      reason_for_leaving_therapy,
      current_therapy_type,
      "create"
    );

    // 4. Creación en la BD
    const result = await additionalPatientInformationService.create(objectSanitized);

    return sendSuccess(res, "Información adicional registrada correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza un registro de información adicional existente por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const updateAdditionalPatientInformation = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await additionalPatientInformationService.getById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró la información adicional para actualizar", []);
    }

    const updateData = req.body;

    const cleanUpdates = {};

    if (updateData.civil_status !== undefined) {
      cleanUpdates.civil_status = updateData.civil_status ? updateData.civil_status.trim() : null;
    }

    if (updateData.second_phone !== undefined) {
      const phoneNum = parseInt(updateData.second_phone, 10);
      if (isNaN(phoneNum)) {
        return sendError(res, 400, "El segundo teléfono debe ser un número válido", []);
      }
      cleanUpdates.second_phone = phoneNum;
    }

    if (updateData.living_with !== undefined) {
      cleanUpdates.living_with = updateData.living_with ? updateData.living_with.trim() : null;
    }

    if (updateData.profession !== undefined) {
      cleanUpdates.profession = updateData.profession ? updateData.profession.trim() : null;
    }

    if (updateData.derivation !== undefined) {
      cleanUpdates.derivation = updateData.derivation ? updateData.derivation.trim() : null;
    }

    if (updateData.has_had_therapy !== undefined && updateData.has_had_therapy !== null) {
      const therapyVal = parseInt(updateData.has_had_therapy, 10);
      if (therapyVal !== 0 && therapyVal !== 1) {
        return sendError(res, 400, "El valor de 'a_realizado_terapia' debe ser 0 o 1", []);
      }
      cleanUpdates.has_had_therapy = therapyVal;
    }
    
    if (updateData.therapy_duration !== undefined) {
      cleanUpdates.therapy_duration = updateData.therapy_duration ? updateData.therapy_duration.trim() : null;
    }

    if (updateData.reason_for_leaving_therapy !== undefined) {
      cleanUpdates.reason_for_leaving_therapy = updateData.reason_for_leaving_therapy ? updateData.reason_for_leaving_therapy.trim() : null;
    }

    if (updateData.current_therapy_type !== undefined) {
      cleanUpdates.current_therapy_type = updateData.current_therapy_type ? updateData.current_therapy_type.trim() : null;
    }

    cleanUpdates.updated_at = getCurrentDate();

    const result = await additionalPatientInformationService.update(id, cleanUpdates);

    return sendSuccess(res, "Información adicional actualizada correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const additionalPatientInformationController = {
  getAllAdditionalPatientInformation,
  getAdditionalPatientInformationById,
  createAdditionalPatientInformation,
  updateAdditionalPatientInformation
};
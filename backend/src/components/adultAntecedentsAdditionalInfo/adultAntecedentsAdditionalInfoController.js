import { adultAntecedentsAdditionalInfoService } from "./adultAntecedentsAdditionalInfoService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { adultAntecedentsAdditionalInfoValidations } from "./adultAntecedentsAdditionalInfoValidations.js";
import { adultAntecedentsAdditionalInfoSanitized } from "./adultAntecedentsAdditionalInfoSanitized.js";

/**
 * Obtiene todos los registros de antecedentes de adultos en el sistema.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getAllAdultAntecedents = async (req, res) => {
  try {
    const infoList = await adultAntecedentsAdditionalInfoService.getAll();

    if (!infoList || infoList.length === 0) {
      return sendError(res, 404, "No se encontraron registros de antecedentes de adultos", []);
    }

    return sendSuccess(res, "Antecedentes de adultos obtenidos correctamente", infoList);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un registro de antecedentes de adultos por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const getAdultAntecedentsById = async (req, res) => {
  try {
    const { id } = req.params;

    const additionalInfo = await adultAntecedentsAdditionalInfoService.getById(id);

    if (!additionalInfo) {
      return sendError(res, 404, "No se encontró el registro de antecedentes buscado", []);
    }

    return sendSuccess(res, "Antecedentes obtenidos correctamente", additionalInfo);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo registro de antecedentes de adultos asociado a una entrevista.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const createAdultAntecedents = async (req, res) => {
  try {
    const {
      id_interview,
      pathologies_diseases,
      medication,
      substance_alcohol_consumption,
      hobbies_sports,
      negative_thoughts,
      abuse_mistreatment
    } = req.body;

    // 1. Verificar que no exista ya un registro para esta entrevista (relación 1 a 1)
    const infoExists = await adultAntecedentsAdditionalInfoService.getByInterviewId(id_interview);
    if (infoExists) {
      return sendError(res, 400, "Ya existen antecedentes registrados para esta entrevista", []);
    }

    // 2. Validaciones específicas
    await adultAntecedentsAdditionalInfoValidations(
      id_interview,
      pathologies_diseases,
      medication,
      substance_alcohol_consumption,
      hobbies_sports,
      negative_thoughts,
      abuse_mistreatment
    );

    // 3. Sanitización
    const { objectSanitized } = adultAntecedentsAdditionalInfoSanitized(
      id_interview,
      pathologies_diseases,
      medication,
      substance_alcohol_consumption,
      hobbies_sports,
      negative_thoughts,
      abuse_mistreatment,
      "create"
    );

    // 4. Creación en la BD
    const result = await adultAntecedentsAdditionalInfoService.create(objectSanitized);

    return sendSuccess(res, "Antecedentes registrados correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza un registro de antecedentes de adultos existente por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
const updateAdultAntecedents = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await adultAntecedentsAdditionalInfoService.getById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el registro de antecedentes para actualizar", []);
    }

    const updateData = req.body;
    const cleanUpdates = {};

    if (updateData.pathologies_diseases !== undefined) {
      cleanUpdates.pathologies_diseases = updateData.pathologies_diseases
        ? updateData.pathologies_diseases.trim()
        : null;
    }

    if (updateData.medication !== undefined) {
      cleanUpdates.medication = updateData.medication ? updateData.medication.trim() : null;
    }

    if (updateData.substance_alcohol_consumption !== undefined) {
      cleanUpdates.substance_alcohol_consumption = updateData.substance_alcohol_consumption
        ? updateData.substance_alcohol_consumption.trim()
        : null;
    }

    if (updateData.hobbies_sports !== undefined) {
      cleanUpdates.hobbies_sports = updateData.hobbies_sports ? updateData.hobbies_sports.trim() : null;
    }

    if (updateData.negative_thoughts !== undefined) {
      cleanUpdates.negative_thoughts = updateData.negative_thoughts ? updateData.negative_thoughts.trim() : null;
    }

    if (updateData.abuse_mistreatment !== undefined) {
      cleanUpdates.abuse_mistreatment = updateData.abuse_mistreatment ? updateData.abuse_mistreatment.trim() : null;
    }

    cleanUpdates.updated_at = getCurrentDate();

    const result = await adultAntecedentsAdditionalInfoService.update(id, cleanUpdates);

    return sendSuccess(res, "Antecedentes actualizados correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const adultAntecedentsAdditionalInfoController = {
  getAllAdultAntecedents,
  getAdultAntecedentsById,
  createAdultAntecedents,
  updateAdultAntecedents
};
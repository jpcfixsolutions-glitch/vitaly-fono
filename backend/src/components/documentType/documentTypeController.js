import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { documentTypeService } from "./documentTypeService.js";
import { documentTypeValidations } from "./documentTypeValidations.js";
import { documentTypeSanitized } from "./documentTypeSanitized.js";

/**
 * Obtiene todos los tipos de documentos.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {Promise<void>}
 */
const getAllDocumentTypes = async (req, res) => {
  try {
    const documentTypes = await documentTypeService.getAllDocumentTypes();

    if (!documentTypes || documentTypes.length === 0) {
      return sendError(res, 404, "No se encontraron tipos de documento registrados", []);
    }

    return sendSuccess(res, "Tipos de documento obtenidos correctamente", documentTypes);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo tipo de documento.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {Promise<void>}
 */
const createDocumentType = async (req, res) => {
  try {
    const { name, status, id_user } = req.body;

    await documentTypeValidations(name, id_user);

    const { objectSanitized } = documentTypeSanitized(name, status, id_user);
    
    const documentType = await documentTypeService.createDocumentType(objectSanitized);
    return sendSuccess(res, "Tipo de documento creado correctamente", documentType, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export const documentTypeController = {
  getAllDocumentTypes,
  createDocumentType
}

import { typeServiceService } from "./typeServiceService.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { userService } from "../user/userService.js";
import { typeServiceSanitized } from "./typeServiceSanitized.js";
import { typeServiceValidations } from "./typeServiceValidations.js";

/**
 * Obtiene todos los tipos de servicios disponibles.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con todos los tipos de servicio.
 */
const getAllTypeService = async (req, res) => {
  try {
    const allTypeservices = await typeServiceService.getAllTypeService();

    if (!allTypeservices || allTypeservices.length === 0) {
      return sendError(res, 404, "No se encontraron tipos de servicios registrados", []);
    }

    return sendSuccess(res, "Tipos de servicios obtenidos correctamente", allTypeservices);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Obtiene un tipo de servicio específico por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el tipo de servicio encontrado.
 */
const getTypeServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundTypeService = await typeServiceService.getTypeServiceById(id);

    if (!foundTypeService) {
      return sendError(res, 404, "No se encontró el tipo de servicio buscado", []);
    }

    return sendSuccess(res, "Tipo de servicio obtenido correctamente", foundTypeService);

  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Crea un nuevo tipo de servicio.
 *
 * Valida existencia de usuario y si el servicio ya existe, lo crea, reactiva o lanza error según sea el caso.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el tipo de servicio creado o reactivado.
 */
const createTypeService = async (req, res) => {
  try {
    const { name, description, price, id_user, status } = req.body;

    const existsUser = await userService.getUserById(id_user);
    if (!existsUser) {
      return sendError(res, 404, "No se encontró el usuario para crear el tipo de servicio", []);
    }

    typeServiceValidations(name, description, price);

    const typeServiceExists = await typeServiceService.getTypeServiceByName(name, id_user);
    if (typeServiceExists && typeServiceExists.status === "Activo") {
      return sendError(res, 400, "El servicio existe y está activo", []);
    } else if (typeServiceExists && typeServiceExists.status === "Inactivo") {
      const { objectSanitized } = typeServiceSanitized(name, description, price, id_user, status, "update");

      const result = await typeServiceService.updateTypeService(typeServiceExists.id, objectSanitized);

      return sendSuccess(res, "Tipo de servicio reactivado correctamente", result, 200);
    } else if (!typeServiceExists) {
      const { objectSanitized } = typeServiceSanitized(name, description, price, id_user, "Activo", "create");

      const result = await typeServiceService.createTypeService(objectSanitized);
      return sendSuccess(res, "Tipo de servicio creado correctamente", result, 201);
    }

  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Actualiza un tipo de servicio existente.
 *
 * Valida existencia de servicio y usuario, y que no se duplique el nombre de servicios activos/inactivos.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP, debe incluir el id en params y campos actualizados en body.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el tipo de servicio actualizado.
 */
const updateTypeService = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await typeServiceService.getTypeServiceById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el tipo de servicio", []);
    }

    const { name, description, price, id_user, status } = req.body;

    const existsUser = await userService.getUserById(id_user);
    if (!existsUser) {
      return sendError(res, 404, "No se encontró el usuario para actualizar el tipo de servicio", []);
    }

    typeServiceValidations(name, description, price);

    const typeServiceExists = await typeServiceService.getTypeServiceByName(name, id_user);

    if (typeServiceExists && typeServiceExists.id !== id) {
      if (typeServiceExists.status === "Activo") {
        return sendError(res, 400, "El servicio existe y está activo", []);
      }

      if (typeServiceExists.status === "Inactivo") {
        return sendError(res, 400, `El servicio "${name}" ya existe y está inactivo. Para reactivarlo, créelo nuevamente o reactivelo desde el listado de inactivos.`, []);
      }
    }

    const { objectSanitized } = typeServiceSanitized(name, description, price, id_user, status, "update");

    const result = await typeServiceService.updateTypeService(id, objectSanitized);
    return sendSuccess(res, "Servicio actualizado correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Da de baja (desactiva) un tipo de servicio por su ID.
 *
 * Cambia el estado a "Inactivo" si el servicio existe.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP, debe incluir el id en params.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP confirmando la baja del servicio.
 */
const deactivateTypeService = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await typeServiceService.getTypeServiceById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el servicio", []);
    }

    await typeServiceService.deactivateTypeService(id);

    return sendSuccess(res, "Servicio dado de baja correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export const typeServiceController = {
  getAllTypeService,
  getTypeServiceById,
  createTypeService,
  updateTypeService,
  deactivateTypeService
};
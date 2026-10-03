import { healthInsuranceService } from "./healthInsuranceService.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { userService } from "../user/userService.js";
import { healthInsuranceValidations } from "./healthInsuranceValidations.js";
import { healthInsuranceSanitized } from "./healthInsuranceSanitized.js";

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
const getAllHealthInsurances = async (req, res) => {
  try {
    const healthInsurances = await healthInsuranceService.getAllHealthInsurances();

    if (!healthInsurances || healthInsurances.length === 0) {
      return sendError(res, 404, "No se encontraron obras sociales registradas", []);
    }

    return sendSuccess(res, "Obras sociales obtenidas correctamente", healthInsurances);
  } catch (error) {
    return handleControllerError(res, error);
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
const getHealthInsuranceById = async (req, res) => {
  try {
    const { id } = req.params;

    const healthInsurance = await healthInsuranceService.getHealthInsuranceById(id);

    if (!healthInsurance) {
      return sendError(res, 404, "No se encontró la obra social buscada", []);
    }

    return sendSuccess(res, "Obra social obtenida correctamente", healthInsurance);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


const createHealthInsurance = async (req, res) => {
  try {
    const { name, id_user, status } = req.body;

    const existsUser = await userService.getUserById(id_user);
    if (!existsUser) {
      return sendError(res, 404, "No se encontró el usuario para crear la obra social", []);
    }

    healthInsuranceValidations(name, id_user);

    const healthInsuranceExists = await healthInsuranceService.getHealthInsurancesByName(name, id_user);
    if (healthInsuranceExists && healthInsuranceExists.status === "Activo") {
      return sendError(res, 400, "La obra social está activa", []);
    } else if (healthInsuranceExists && healthInsuranceExists.status === "Inactivo") {
      const { objectSanitized } = healthInsuranceSanitized(name, id_user, status, "update");

      const result = await healthInsuranceService.updateHealthInsurance(healthInsuranceExists.id, objectSanitized);

      return sendSuccess(res, "Obra social reactivada correctamente", result, 200);
    } else if (!healthInsuranceExists) {
      const { objectSanitized } = healthInsuranceSanitized(name, id_user, "Activo", "create");

      const result = await healthInsuranceService.createHealthInsurance(objectSanitized);
      return sendSuccess(res, "Obra social creada correctamente", result, 201);
    }
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza una obra social existente por ID.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Object>} Objeto de la obra social actualizada.
 * @throws {AppError} Si ocurre un error al actualizar la obra social.
 */
const updateHealthInsurance = async (req, res) => {
  try {
    const { id } = req.params;

    const existsHealthInsurance = await healthInsuranceService.getHealthInsuranceById(id);
    if (!existsHealthInsurance) {
      return sendError(res, 404, "No se encontró la obra social", []);
    }

    const { name, id_user, status } = req.body;

    const existsUser = await userService.getUserById(id_user);
    if (!existsUser) {
      return sendError(res, 404, "No se encontró el usuario para actualizar la obra social", []);
    }

    healthInsuranceValidations(name, id_user);

    const healthInsuranceExists = await healthInsuranceService.getHealthInsurancesByName(name, id_user);

    if (healthInsuranceExists && healthInsuranceExists.id !== id) {
      if (healthInsuranceExists.status === "Activo") {
        return sendError(res, 400, "Ya existe una obra social con ese nombre y está activa", []);
      }

      if (healthInsuranceExists.status === "Inactivo") {
        return sendError(res, 400, `La obra social "${name}" ya existe y está inactiva.`, []);
      }
    }

    const { objectSanitized } = healthInsuranceSanitized(name, id_user, status, "update");

    const result = await healthInsuranceService.updateHealthInsurance(id, objectSanitized);
    return sendSuccess(res, "Obra social actualizada correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Desactiva una obra social existente por ID.
 *
 * @async
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<Object>} Objeto de la obra social desactivada.
 * @throws {AppError} Si ocurre un error al desactivar la obra social.
 */
const deactivateHealthInsurance = async (req, res) => {
  try {
    const { id } = req.params;

    const existsHealthInsurance = await healthInsuranceService.getHealthInsuranceById(id);

    if (!existsHealthInsurance) {
      return sendError(res, 404, "No se encontró la obra social", []);
    }

    await healthInsuranceService.deactivateHealthInsurance(id);
    return sendSuccess(res, "Obra social dado de baja correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


export const healthInsuranceController = {
  getAllHealthInsurances,
  getHealthInsuranceById,
  createHealthInsurance,
  updateHealthInsurance,
  deactivateHealthInsurance
};
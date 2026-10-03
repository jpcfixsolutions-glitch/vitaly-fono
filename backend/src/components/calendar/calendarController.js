import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { calendarService, calendarValidations, calendarSanitized } from "./index.js";
import { userService } from "../user/userService.js";

/**
 * Obtiene todas las configuraciones del diagrama de calendario.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna una respuesta HTTP con las configuraciones encontradas o un mensaje de error.
 */
const getAllConfigurations = async (req, res) => {
  try {
    const configurations = await calendarService.getAllConfigurations();

    if (!configurations || configurations.length === 0) {
      return sendError(res, 404, "No se encontraron configuraciones registradas", []);
    }

    return sendSuccess(res, "Configuraciones obtenidas correctamente", configurations);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Obtiene una configuración del diagrama de calendario por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna una respuesta HTTP con la configuración encontrada o un mensaje de error.
 */
const getConfigurationById = async (req, res) => {
  try {
    const { id } = req.params;

    const configuration = await calendarService.getConfigurationById(id);

    if (!configuration) {
      return sendError(res, 404, "No se encontró la configuración", []);
    }

    return sendSuccess(res, "Configuración obtenida correctamente", configuration);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Crea una nueva configuración para el diagrama de calendario.
 *
 * Valida los campos requeridos y sus formatos, y luego crea la configuración si es válida.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna una respuesta HTTP con la configuración creada o un mensaje de error.
 */
const createConfiguration = async (req, res) => {
  try {
    const { day, start_time, end_time, id_user } = req.body;

    const existsUser = await userService.getUserById(id_user);
    if (!existsUser) {
      return sendError(res, 404, "No se encontró el usuario para crear la configuración", []);
    }

    calendarValidations(day, start_time, end_time);

    const { objectSanitized } = calendarSanitized(day, start_time, end_time, id_user, "create");

    const configuration = await calendarService.createConfiguration(objectSanitized);

    return sendSuccess(res, "Configuración creado correctamente", configuration, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Actualiza una configuración existente del diagrama de calendario.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP, debe contener en params el id de la configuración y en body los campos a actualizar.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna una respuesta HTTP con la configuración actualizada o un mensaje de error.
 */
const updateConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const existsConfiguration = await calendarService.getConfigurationById(id);
    if (!existsConfiguration) {
      return sendError(res, 404, "No se encontró la configuración del calendario", []);
    }

    const { day, start_time, end_time, id_user } = req.body;

    const existsUser = await userService.getUserById(id_user);
    if (!existsUser) {
      return sendError(res, 404, "No se encontró el usuario", []);
    }

    const dayProvisional = day ? day.charAt(0).toUpperCase() + day.slice(1).toLowerCase() 
                             : existsConfiguration.day;
    const startTimeProvisional = start_time ? start_time : existsConfiguration.start_time;
    const endTimeProvisional = end_time ? end_time : existsConfiguration.end_time;

    calendarValidations(dayProvisional, startTimeProvisional, endTimeProvisional);

    const { objectSanitized } = calendarSanitized(dayProvisional, startTimeProvisional, endTimeProvisional, id_user, "update");

    const configuration = await calendarService.updateConfiguration(id, objectSanitized);

    return sendSuccess(res, "Configuración actualizada correctamente", configuration);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

/**
 * Elimina una configuración existente del diagrama de calendario.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP, debe contener en params el id de la configuración.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el mensaje de éxito o un mensaje de error.
 */
const deleteConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const existsConfiguration = await calendarService.getConfigurationById(id);
    if (!existsConfiguration) {
      return sendError(res, 404, "No se encontró la configuración del calendario", []);
    }

    await calendarService.deleteConfiguration(id);
    return sendSuccess(res, "Configuración eliminada correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export const calendarController = {
  getAllConfigurations,
  getConfigurationById,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration
}
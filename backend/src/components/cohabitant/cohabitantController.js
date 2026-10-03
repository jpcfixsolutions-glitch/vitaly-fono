import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { cohabitantService } from "./cohabitantService.js";
import { cohabitantValidations } from "./cohabitantValidations.js";
import { cohabitantSanitized } from "./cohabitantSanitized.js";

/**
 * Obtiene todos los convivientes.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getAllCohabitants = async (req, res) => {
  try {
    const items = await cohabitantService.getAllCohabitants();

    if (!items || items.length === 0) {
      return sendError(res, 404, "No se encontraron registros de convivientes", []);
    }

    return sendSuccess(res, "Convivientes obtenidos correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un conviviente por su identificador.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getCohabitantById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await cohabitantService.getCohabitantById(id);
    if (!item) {
      return sendError(res, 404, "No se encontró el conviviente buscado", []);
    }

    return sendSuccess(res, "Conviviente obtenido correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo conviviente.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const createCohabitant = async (req, res) => {
  try {
    const { id_interview, domestic_cohabitation, non_domestic_cohabitation } = req.body;

    await cohabitantValidations(id_interview);

    // dejo este todo por si las dudas: no se si tiraria algun error domestic_cohabitation y non_domestic_cohabitation, pero si es asi, deberiamos implementar de la misma forma que hay en el update, si se recibe algun valor en estas variables, las dejamos, pero sino ponemos ""
    // const idInterviewProvisional = id_interview ? id_interview : "";
    // const domesticCohabitationProvisional = domestic_cohabitation ? domestic_cohabitation : "";
    // const nonDomesticCohabitationProvisional = non_domestic_cohabitation ? non_domestic_cohabitation : "";

    const { objectSanitized } = cohabitantSanitized(id_interview, domestic_cohabitation, non_domestic_cohabitation, "create");

    const result = await cohabitantService.createCohabitant(objectSanitized);

    return sendSuccess(res, "Conviviente registrado correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza los datos de un conviviente existente.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const updateCohabitant = async (req, res) => {
  try {
    const { id } = req.params;

    const existCoHabitant = await cohabitantService.getCohabitantById(id);
    if (!existCoHabitant) {
      return sendError(res, 404, "No se encontró el conviviente", []);
    }

    const { id_interview, domestic_cohabitation, non_domestic_cohabitation } = req.body;

    const idInterviewProvisional = id_interview ? id_interview : existCoHabitant.id_interview;
    const domesticCohabitationProvisional = domestic_cohabitation ? domestic_cohabitation : existCoHabitant.domestic_cohabitation;
    const nonDomesticCohabitationProvisional = non_domestic_cohabitation ? non_domestic_cohabitation : existCoHabitant.non_domestic_cohabitation;

    // Esta estaria de mas, porque no hay validaciones para domestic_cohabitation y non_domestic_cohabitation. si hubiese validaciones si tiene sentido.
    await cohabitantValidations(idInterviewProvisional);

    const { objectSanitized } = cohabitantSanitized(idInterviewProvisional, domesticCohabitationProvisional, nonDomesticCohabitationProvisional, "update");

    const result = await cohabitantService.updateCohabitant(id, objectSanitized);

    return sendSuccess(res, "Conviviente actualizado correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const cohabitantController = {
  getAllCohabitants,
  getCohabitantById,
  createCohabitant,
  updateCohabitant,
};

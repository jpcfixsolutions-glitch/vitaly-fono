import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { fatherService } from "./fatherService.js";
import { fatherValidations } from "./fatherValidations.js";
import { fatherSanitized } from "./fatherSanitized.js";
import { firstInterviewService } from "../firstInterview/firstInterviewService.js";
/**
 * Obtiene todos los padres.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getAllFathers = async (req, res) => {
  try {
    const items = await fatherService.getAllFathers();

    if (!items || items.length === 0) {
      return sendError(res, 404, "No se encontraron registros de los padres", []);
    }

    return sendSuccess(res, "Padres obtenidos correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un padre por su identificador.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const getFatherById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await fatherService.getFatherById(id);

    if (!item) {
      return sendError(res, 404, "No se encontró el padre", []);
    }

    return sendSuccess(res, "Padre obtenido correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo padre.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const createFather = async (req, res) => {
  try {
    const { 
      id_interview, 
      father_name, 
      father_age, 
      father_lives, 
      father_profession, 
      father_work_hours 
    } = req.body;

    const existsInterview = await firstInterviewService.getFirstInterviewById(id_interview);
    if (!existsInterview) {
      return sendError(res, 404, "No se encontró la primera entrevista", []);
    }

    // lo mismo aca, si tira error porque estan vacios, entonces aplicar lo mismo que el update.
    
    fatherValidations(id_interview, father_name, father_age, father_lives, father_profession, father_work_hours);

    const { objectSanitized } = fatherSanitized(id_interview, father_name, father_age, father_lives, father_profession, father_work_hours, "create");

    const result = await fatherService.createFather(objectSanitized);

    return sendSuccess(res, "Padre registrado correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza los datos de un padre existente.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const updateFather = async (req, res) => {
  try {
    const { id } = req.params;


    const exists = await fatherService.getFatherById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el padre", []);
    }


    const { id_interview, name, age, lives, profession_studies, work_hours } = req.body;


    const existsInterview = await firstInterviewService.getFirstInterviewById(id_interview);
    if (!existsInterview) {
      return sendError(res, 404, "No se encontró la primera entrevista", []);
    }

    
    const idInterviewProvisional = id_interview ? id_interview : exists.id_interview;
    const nameProvisional = name ? name : exists.name;
    const ageProvisional = age ? age : exists.age;
    const livesProvisional = lives ? lives : exists.lives;
    const professionStudiesProvisional = profession_studies ? profession_studies : exists.profession_studies;
    const workHoursProvisional = work_hours ? work_hours : exists.work_hours;

    fatherValidations(idInterviewProvisional, nameProvisional, ageProvisional, livesProvisional, professionStudiesProvisional, workHoursProvisional);

    
    const { objectSanitized } = fatherSanitized(idInterviewProvisional, nameProvisional, ageProvisional, livesProvisional, professionStudiesProvisional, workHoursProvisional, "update");


    const result = await fatherService.updateFather(id, objectSanitized);


    return sendSuccess(res, "Padre actualizado correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const fatherController = {
  getAllFathers,
  getFatherById,
  createFather,
  updateFather
};







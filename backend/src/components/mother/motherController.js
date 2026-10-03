import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { motherService } from "./motherService.js";
import { motherValidations } from "./motherValidations.js";
import { motherSanitized } from "./motherSanitized.js";
import { firstInterviewService } from "../firstInterview/firstInterviewService.js";

/**
 * Obtiene todas las madres.
 * @async
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllMothers = async (req, res) => {
  try {
    const items = await motherService.getAllMothers();
    if (!items || items.length === 0) {
      return sendError(res, 404, "No se encontraron registros de madre", []);
    }
    return sendSuccess(res, "Madres obtenidas correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene una madre por ID.
 * @async
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getMotherById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await motherService.getMotherById(id);
    if (!item) {
      return sendError(res, 404, "No se encontró la madre", []);
    }
    return sendSuccess(res, "Madre obtenida correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea una nueva madre.
 * @async
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createMother = async (req, res) => {
  try {
    const { 
      id_interview, 
      mother_name, 
      mother_age, 
      mother_lives, 
      mother_profession, 
      mother_work_hours 
    } = req.body;

    const existsInterview = await firstInterviewService.getFirstInterviewById(id_interview);
    if (!existsInterview) {
      return sendError(res, 404, "No se encontró la primera entrevista", []);
    }

    // lo mismo aca, si tira error porque estan vacios, entonces aplicar lo mismo que el update.

    motherValidations(id_interview, mother_name, mother_age, mother_lives, mother_profession, mother_work_hours);

    const { objectSanitized } = motherSanitized(id_interview, mother_name, mother_age, mother_lives, mother_profession, mother_work_hours, "create");
    
    const result = await motherService.createMother(objectSanitized);

    return sendSuccess(res, "Madre registrada correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza una madre existente.
 * @async
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const updateMother = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exists = await motherService.getMotherById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró la madre", []);
    }

    const { id_interview, name, age, lives, profession_studies, work_hours } = req.body;

    const existsInterview = await firstInterviewService.getFirstInterviewById(id_interview);
    if (!existsInterview) {
      return sendError(res, 404, "No se encontró la primera entrevista", []);
    }

    const idInterviewProvisional = id_interview ? id_interview : exists.id_interview;
    const nameProvisional = name ? name : exists.mother_name;
    const ageProvisional = age ? age : exists.mother_age;
    const livesProvisional = lives ? lives : exists.mother_lives;
    const professionStudiesProvisional = profession_studies ? profession_studies : exists.mother_profession;
    const workHoursProvisional = work_hours ? work_hours : exists.mother_work_hours;

    motherValidations(idInterviewProvisional, nameProvisional, ageProvisional, livesProvisional, professionStudiesProvisional, workHoursProvisional);

    const { objectSanitized } = motherSanitized(idInterviewProvisional, nameProvisional, ageProvisional, livesProvisional, professionStudiesProvisional, workHoursProvisional, "update");

    const updated = await motherService.updateMother(id, objectSanitized);

    return sendSuccess(res, "Madre actualizada correctamente", updated);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const motherController = {
  getAllMothers,
  getMotherById,
  createMother,
  updateMother
};

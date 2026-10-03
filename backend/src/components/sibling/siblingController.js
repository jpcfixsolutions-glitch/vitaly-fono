import { siblingService } from "./siblingService.js";
import { firstInterviewService } from "../firstInterview/firstInterviewService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";


const getAllSiblings = async (req, res) => {
  try {
    const items = await siblingService.getAllSiblings();

    if (!items || items.length === 0) {
      return sendError(res, 200, "No se encontraron hermanos", []);
    }

    return sendSuccess(res, "Hermanos obtenidos correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getSiblingById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await siblingService.getSiblingById(id);
    if (!item) {
      return sendError(res, 404, "No se encontró el hermano buscado", []);
    }

    return sendSuccess(res, "Hermano obtenido correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


const createSibling = async (req, res) => {
  try {
    let siblingsToProcess = [];

    if (Array.isArray(req.body)) {
      siblingsToProcess = req.body;
    } else {
      siblingsToProcess = [req.body];
    }

    const createdSiblings = [];
    const errors = [];
    const now = getCurrentDate();

    for (const siblingData of siblingsToProcess) {
      const {
        id_interview,
        name,
        age,
        studies,
      } = siblingData;

      if (!id_interview) {
        errors.push({
          error: "Faltan datos obligatorios para crear el registro de hermano",
          data: siblingData,
        });
        continue;
      }

      const interviewExists = await firstInterviewService.getFirstInterviewById(id_interview);
      if (!interviewExists) {
        errors.push({
          error: "No se encontró la entrevista asociada",
          data: siblingData,
        });
        continue;
      }

      const data = {
        id_interview,
        name,
        age,
        studies: studies ?? null,
        created_at: now,
        updated_at: now,
      };

      try {
        const result = await siblingService.createSibling(data);
        createdSiblings.push(result);
      } catch (err) {
        errors.push({
          error: "Error interno al guardar en base de datos",
          data: siblingData,
        });
        continue;
      }
    } 

    if (createdSiblings.length > 0) {
      return sendSuccess(res, "Hermanos creados correctamente", {
        created: createdSiblings,
        failed: errors,
      }, 201);
    } else {
      return sendError(res, 400, "No se pudieron crear los hermanos", errors);
    }
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const updateSibling = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_interview,
      name,
      age,
      studies,
    } = req.body;


    const exists = await siblingService.getSiblingById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el hermano", []);
    }


    const dataToUpdate = {};

    if (id_interview !== undefined) dataToUpdate.id_interview = id_interview;
    if (name !== undefined) dataToUpdate.name = name;
    if (age !== undefined) dataToUpdate.age = age;
    if (studies !== undefined) dataToUpdate.studies = studies;

    if (Object.keys(dataToUpdate).length === 0) {
      return sendError(res, 400, "No se enviaron datos para actualizar", []);
    }


    dataToUpdate.updated_at = getCurrentDate();


    const updated = await siblingService.updateSibling(id, dataToUpdate);

    return sendSuccess(res, "Hermano actualizado correctamente", updated);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const deleteSibling = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await siblingService.getSiblingById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el hermano", []);
    }

    // Delete 
    const deleted = await siblingService.deleteSibling(id);

    return sendSuccess(res, "Hermano eliminado correctamente", deleted);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const siblingController = {
  getAllSiblings,
  getSiblingById,
  createSibling,
  updateSibling,
  deleteSibling,
};
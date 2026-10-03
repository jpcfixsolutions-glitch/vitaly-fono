import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { schoolingService } from "./schoolingService.js";

const getAllSchoolings = async (req, res) => {
  try {
    const items = await schoolingService.getAllSchoolings();
    if (!items || items.length === 0) {
      return sendError(res, 200, "No se encontraron registros de escolaridades", []);
    }
    return sendSuccess(res, "Escolaridades obtenidas correctamente", items);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getSchoolingById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await schoolingService.getSchoolingById(id);
    if (!item) {
      return sendError(res, 404, "No se encontró la escolaridad buscada", []);
    }
    return sendSuccess(res, "Escolaridad obtenida correctamente", item);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const createSchooling = async (req, res) => {
  try {
    const {
      id_interview,
      schooling_year,
      current_course,
      orientation,
      school_name,
      repeat_course,
      repeat_course_reason,
      school_changes,
      school_changes_reason,
      initial_level,
      primary_level,
      secondary_level,
      general_remarks,
    } = req.body;

    if (!id_interview) {
      return sendError(res, 400, "Faltan datos obligatorios para crear la escolaridad", []);
    }

    const data = {
      id_interview,
      schooling_year,
      current_course,
      orientation,
      school_name,
      repeat_course,
      repeat_course_reason,
      school_changes,
      school_changes_reason,
      initial_level,
      primary_level,
      secondary_level,
      general_remarks,
    };

    const result = await schoolingService.createSchooling(data);

    return sendSuccess(res, "Escolaridad registrada correctamente", result, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const schoolingController = {
  getAllSchoolings,
  getSchoolingById,
  createSchooling,
  updateByInterview: async (req, res) => {
    try {
      const { interviewId } = req.params;


      const payload = req.body || {};


      // Normalizamos solo campos válidos de escolaridad
      const data = {
        ...(typeof payload.schooling_year !== "undefined" ? { schooling_year: payload.schooling_year } : {}),
        ...(typeof payload.current_course !== "undefined" ? { current_course: payload.current_course } : {}),
        ...(typeof payload.orientation !== "undefined" ? { orientation: payload.orientation } : {}),
        ...(typeof payload.school_name !== "undefined" ? { school_name: payload.school_name } : {}),
        ...(typeof payload.repeat_course !== "undefined" ? { repeat_course: payload.repeat_course } : {}),
        ...(typeof payload.repeat_course_reason !== "undefined" ? { repeat_course_reason: payload.repeat_course_reason } : {}),
        ...(typeof payload.school_changes !== "undefined" ? { school_changes: payload.school_changes } : {}),
        ...(typeof payload.school_changes_reason !== "undefined" ? { school_changes_reason: payload.school_changes_reason } : {}),
        ...(typeof payload.nivel_inicial !== "undefined" ? { nivel_inicial: payload.nivel_inicial } : {}),
        ...(typeof payload.primary_level !== "undefined" ? { primary_level: payload.primary_level } : {}),
        ...(typeof payload.secondary_level !== "undefined" ? { secondary_level: payload.secondary_level } : {}),
        ...(typeof payload.general_remarks !== "undefined" ? { general_remarks: payload.general_remarks } : {}),
      };


      // Buscar si existe escolaridad para la entrevista
      const exists = await schoolingService.getSchoolingByInterviewId(interviewId);
      if (exists) {
        const updated = await schoolingService.updateSchoolingByInterviewId(interviewId, data);
        return sendSuccess(res, "Escolaridad actualizada correctamente", updated);
      }

      // Si no existe, crear SOLO si llegan los campos mínimos requeridos (para respetar NOT NULL)
      if (data.schooling_year && data.current_course && data.orientation && data.school_name) {
        const created = await schoolingService.createSchooling({
          id_interview: interviewId,
          ...data,
        });
        return sendSuccess(res, "Escolaridad creada correctamente", created, 201);
      }

      // Si no hay registro previo y no hay datos mínimos, devolvemos éxito sin cambios
      return sendSuccess(res, "No se aplicaron cambios de escolaridad", null);
    } catch (error) {
      return handleControllerError(res, error);
    }
  },
  deleteSchooling: async (req, res) => {
    try {
      const { id } = req.params;
      const exists = await schoolingService.getSchoolingById(id);
      if (!exists) {
        return sendError(res, 404, "No se encontró la escolaridad", []);
      }
      const updated = await schoolingService.deleteSchooling(id);
      return sendSuccess(res, "Escolaridad dada de baja correctamente", updated);
    } catch (error) {
      return handleControllerError(res, error);
    }
  },
};



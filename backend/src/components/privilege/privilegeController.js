import { privilegeService } from "./privilegeService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sanitizeText } from "../../utils/sanitized.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";

/**
 * Obtiene todos los privilegios activos
 */
const getAllPrivileges = async (req, res) => {
  try {
    const privileges = await privilegeService.getAllPrivileges();

    if (!privileges || privileges.length === 0) {
      return sendError(res, 404, "No se encontraron privilegios registrados", [])
    }

    return sendSuccess(res, "Privilegios obtenidos correctamente", privileges);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Obtiene un privilegio por ID
 */
const getPrivilegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const privilegeFound = await privilegeService.getPrivilegeById(id);

    if (!privilegeFound) {
      return sendError(res, 404, "No se encontró el privilegio buscado", [])
    }

    return sendSuccess(res, "Privilegio obtenido correctamente", privilegeFound)
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo privilegio
 */
const createPrivilege = async (req, res) => {
  try {
    const { name, description } = req.body;
    const date = getCurrentDate();

    //Valida que el nombre sea requerido
    if (!name || typeof name !== 'string') {
      return sendError(res, 400, "El nombre es requerido y debe ser un texto válido", []);
    }

    const sanitizedName = sanitizeText(name, 100);

    //Valida longitud mínima del nombre
    if (sanitizedName.length < 3) {
      return sendError(res, 400, "El nombre debe tener al menos 3 caracteres", []);
    }

    //Valida longitud máxima del nombre
    if (sanitizedName.length > 50) {
      return sendError(res, 400, "El nombre no puede exceder 50 caracteres", []);
    }

    //Valida descripción si es proporcionada
    let sanitizedDescription = null;
    if (description) {
      if (typeof description !== 'string') {
        return sendError(res, 400, "La descripción debe ser un texto válido", []);
      }
      sanitizedDescription = sanitizeText(description, 255);
      if (sanitizedDescription.length > 255) {
        return sendError(res, 400, "La descripción no puede exceder 255 caracteres", []);
      }
    }

    //Verifica si el privilegio ya existe
    const privilegeExists = await privilegeService.getPrivilegeByName(sanitizedName);

    //Si el privilegio ya existe y está activo
    if (privilegeExists && privilegeExists.status === "Activo") {
      return sendError(res, 400, "El privilegio ya existe y está activo", []);
    } else if (privilegeExists && privilegeExists.status === "Inactivo") {
      const dataPrivilege = {
        name: sanitizedName,
        description: sanitizedDescription,
        status: "Activo",
        updated_at: date,
      };
      const result = await privilegeService.updatePrivilege(privilegeExists.id, dataPrivilege);
      return sendSuccess(res, "Privilegio reactivado correctamente", result, 200);
    }
    else {
      //Crear nuevo privilegio
      const dataPrivilege = {
        name: sanitizedName,
        description: sanitizedDescription,
        created_at: date,
        updated_at: date
      };
      const result = await privilegeService.createPrivilege(dataPrivilege);
      return sendSuccess(res, "Privilegio creado correctamente", result, 201);
    }

  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza un privilegio existente
 */
const updatePrivilege = async (req, res) => {
  try {
    const { id } = req.params;
    const existsPrivilege = await privilegeService.getPrivilegeById(id);

    if (!existsPrivilege) {
      return sendError(res, 404, "No se encontró el privilegio", []);
    }

    const { name, description } = req.body;

    const date = getCurrentDate();

    //Validar nombre si es proporcionado
    let sanitizedName = existsPrivilege.name;
    if (name) {
      if (typeof name !== 'string') {
        return sendError(res, 400, "El nombre debe ser un texto válido", []);
      }
      sanitizedName = sanitizeText(name, 100);

      if (sanitizedName.length < 3) {
        return sendError(res, 400, "El nombre debe tener al menos 3 caracteres", []);
      }

      if (sanitizedName.length > 50) {
        return sendError(res, 400, "El nombre no puede exceder 50 caracteres", []);
      }

      //Verificar si el nuevo nombre ya existe en otro privilegio
      const privilegeExists = await privilegeService.getPrivilegeByName(sanitizedName);

      if (privilegeExists && privilegeExists.id !== id) {

        if (privilegeExists.status === "Activo") {
          return sendError(res, 400, "Ya existe un privilegio con ese nombre y está activo", [])
        }
        if (privilegeExists.status === "Inactivo") {
          return sendError(res, 400, `El privilegio "${sanitizedName}" ya existe y está inactivo. Para reactivarlo, créelo nuevamente o reactivelo desde el listado de inactivos.`, []);
        }
      }
    }

    //Validar descripción si es proporcionada
    let sanitizedDescription = existsPrivilege.description;
    if (description !== undefined) {
      if (description === null) {
        sanitizedDescription = null;
      } else if (typeof description !== 'string') {
        return sendError(res, 400, "La descripción debe ser un texto válido", []);
      } else {
        sanitizedDescription = sanitizeText(description, 255);
        if (sanitizedDescription.length > 255) {
          return sendError(res, 400, "La descripción no puede exceder 255 caracteres", []);
        }
      }
    }

    const dataPrivilege = {
      name: sanitizedName,
      description: sanitizedDescription,
      updated_at: date
    };

    const result = await privilegeService.updatePrivilege(id, dataPrivilege);
    return sendSuccess(res, "Privilegio actualizado correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Elimina (da de baja lógica) un privilegio
 */
const deletePrivilege = async (req, res) => {
  try {
    const { id } = req.params;

    const existsPrivilege = await privilegeService.getPrivilegeById(id);

    if (!existsPrivilege) {
      return sendError(res, 404, "No se encontró el privilegio", []);
    }

    const date = getCurrentDate();
    const dataPrivilege = {
      status: "Inactivo",
      updated_at: date
    };
    const result = await privilegeService.updatePrivilege(id, dataPrivilege);
    return sendSuccess(res, "Privilegio eliminado correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};



export const privilegeController = {
  getAllPrivileges,
  getPrivilegeById,
  createPrivilege,
  updatePrivilege,
  deletePrivilege
};
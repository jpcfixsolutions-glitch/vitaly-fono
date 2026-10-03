import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { userService } from "./userService.js"; 
import { roleService } from "../role/roleService.js";
import { turnService } from "../turn/turnService.js";

import { validateCreateUser, validateUpdateUser } from "./userValidations.js";
import { sanitizeUser, prepareUpdateData } from "./userSanitized.js";

/**
 * Obtiene todos los usuarios.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    if (!users || users.length === 0) {
      return sendError(res, 404, "No se encontraron usuarios registrados", []);
    }
    
    // sanitizedUsers es un array de usuarios sanitizados, es decir, sin la contraseña, hay que ver como se mapean desde el frontend.
    const sanitizedUsers = users.map(u => sanitizeUser(u));

    return sendSuccess(res, "Usuarios obtenidos correctamente", sanitizedUsers);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un usuario por ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);
    if (!user) {
      return sendError(res, 404, "Usuario no encontrado", []);
    }

    // sanitizedUser es un usuario sanitizado, es decir, sin la contraseña, hay que ver como se mapea desde el frontend.
    const sanitizedUser = sanitizeUser(user);
    
    return sendSuccess(res, "Usuario obtenido correctamente", sanitizedUser);

  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo usuario.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createUser = async (req, res) => {
  try {
    const { id_rol, name, last_name, email, password } = req.body;

    validateCreateUser({ id_rol, name, last_name, email, password });

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return sendError(res, 400, "El email ya está registrado");
    }

    const user = await userService.createUser({ id_rol, name, last_name, email, password });
    
    return sendSuccess(res, "Usuario creado correctamente", sanitizeUser(user), 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza un usuario.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      return sendError(res, 404, "Usuario inexistente", []);
    }

    const data = req.body;

    validateUpdateUser(data);

    if (data.email && data.email !== existingUser.email) {
      const emailTaken = await userService.getUserByEmail(data.email);
      if (emailTaken) {
        return sendError(res, 400, "El email ya está registrado por otro usuario");
      }
    }

    if (data.id_rol && data.id_rol !== existingUser.id_rol) {
      const userRole = await roleService.getRoleById(data.id_rol);
      if (!userRole) {
        return sendError(res, 404, "No se encontró el rol seleccionado");
      }
    }

    const dataToUpdate = await prepareUpdateData(data);
    const user = await userService.updateUser(id, dataToUpdate);

    return sendSuccess(res, "Usuario actualizado correctamente", sanitizeUser(user));
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Desactiva un usuario.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await userService.getUserById(id);
    if (!existingUser) {
      return sendError(res, 404, "Usuario inexistente", []);
    }

    const pendingTurns = await turnService.getPendingTurnsByUserId(id);
    if (pendingTurns.length > 0) {
      return sendError(res, 400, "No se puede dar de baja el usuario porque tiene turnos pendientes.", []);
    }

    await userService.deactivateUser(id);
    return sendSuccess(res, "Usuario dado de baja correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser
};

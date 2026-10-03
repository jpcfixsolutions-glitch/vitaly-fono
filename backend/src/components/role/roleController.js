import { roleService } from "./roleService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sanitizeText } from "../../utils/sanitized.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { userService } from "../user/userService.js";

/**
 * Obtiene todos los roles activos
 */
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();

        if (!roles || roles.length === 0) {
            return sendError(res, 404, "No se encontraron roles registrados", [])
        }

        return sendSuccess(res, "Roles obtenidos correctamente", roles);
    } catch (error) {
        return handleControllerError(res, error);
    }
};


/**
 * Obtiene un rol por ID
 */
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const roleFound = await roleService.getRoleById(id);

        if (!roleFound) {
            return sendError(res, 404, "No se encontró el rol buscado", [])
        }

        return sendSuccess(res, "Rol obtenido correctamente", roleFound)
    } catch (error) {
        return handleControllerError(res, error);
    }
};

/**
 * Crea un nuevo rol
 */
const createRole = async (req, res) => {
    try {
        const { name, description, privileges } = req.body;

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
            sanitizedDescription = sanitizeText(description, 500);
            if (sanitizedDescription.length > 500) {
                return sendError(res, 400, "La descripción no puede exceder 500 caracteres", []);
            }
        }

        if (privileges && !Array.isArray(privileges)) {
            return sendError(res, 400, "El campo 'privileges' debe ser un array de IDs", []);
        }

        //Verifica si el rol ya existe
        const roleExists = await roleService.getRoleByName(sanitizedName);

        //Si el rol ya existe y está activo
        if (roleExists && roleExists.status === "Activo") {
            return sendError(res, 400, "El rol ya existe y está activo", []);
            //Si el rol existe y no está activo
        }
        else if (roleExists && roleExists.status === "Inactivo") {
            const dataRole = {
                name: sanitizedName,
                description: sanitizedDescription,
                status: "Activo",
                updated_at: date,
            };
            const result = await roleService.updateRole(roleExists.id, dataRole);
            return sendSuccess(res, "Rol reactivado correctamente", result, 200);
        }
        //si no existe se crea
        else {
            //Crear nuevo rol
            const dataRole = {
                name: sanitizedName,
                description: sanitizedDescription,
                created_at: date,
                updated_at: date
            };
            const result = await roleService.createRole(dataRole, privileges || []);
            return sendSuccess(res, "Rol creado correctamente", result, 201);
        }

    } catch (error) {
        return handleControllerError(res, error);
    }
};

/**
 * Actualiza un rol existente
 */

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;

        const existsRole = await roleService.getRoleById(id);
        if (!existsRole) {
            return sendError(res, 404, "No se encontró el rol", []);
        }

        const { name, description, privileges, status } = req.body;

        const date = getCurrentDate();

        //Validar nombre si es proporcionado
        let sanitizedName = existsRole.name;
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

            //Verificar si el nuevo nombre ya existe en otro rol
            const roleExists = await roleService.getRoleByName(sanitizedName);

            if (roleExists && roleExists.id !== id) {

                if (roleExists.status === "Activo") {
                    return sendError(res, 400, "Ya existe un rol con ese nombre y está activo", [])
                }
                if (roleExists.status === "Inactivo") {
                    return sendError(res, 400, `El rol "${sanitizedName}" ya existe y está inactivo. Para reactivarlo, créelo nuevamente o reactivelo desde el listado de inactivos.`, []);
                }
            }
        }

        //Validar descripción si es proporcionada
        let sanitizedDescription = existsRole.description;
        if (description !== undefined) {
            if (description === null) {
                sanitizedDescription = null;
            } else if (typeof description !== 'string') {
                return sendError(res, 400, "La descripción debe ser un texto válido", []);
            } else {
                sanitizedDescription = sanitizeText(description, 500);
                if (sanitizedDescription.length > 500) {
                    return sendError(res, 400, "La descripción no puede exceder 500 caracteres", []);
                }
            }
        }

        if (privileges !== undefined && !Array.isArray(privileges)) {
            return sendError(res, 400, "El campo 'privileges' debe ser un array de IDs", []);
        }

        const dataRole = {
            name: sanitizedName,
            description: sanitizedDescription,
            status,
            updated_at: date
        };

        const result = await roleService.updateRole(id, dataRole, privileges);
        return sendSuccess(res, "Rol actualizado correctamente", result);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

/**
 * Elimina (da de baja lógica) un rol
 */
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const existsRole = await roleService.getRoleById(id);

        if (!existsRole) {
            return sendError(res, 404, "No se encontró el rol", []);
        }

        // 1. Consultar si hay usuarios activos con este rol
        const activeUsers = await userService.getActiveUsersByRoleId(id);
        if (activeUsers.some(user => user.status === "Activo")) {
            return sendError(res, 400, "No se puede dar de baja el rol porque hay usuarios activos asociados.", []);
        }

        const date = getCurrentDate();
        const dataRole = {
            status: "Inactivo",
            updated_at: date
        };
        const result = await roleService.updateRole(id, dataRole);
        return sendSuccess(res, "Rol eliminado correctamente", result);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

export const roleController = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
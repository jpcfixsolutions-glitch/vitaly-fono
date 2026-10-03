import { safeParse } from 'valibot';
import { RegisterSchema, UpdateUserSchema } from '../authUser/authUserSchema.js';
import { AppError } from "../../../errors.js";

/**
 * Valida los datos para crear un usuario.
 * @param {Object} data - Datos del usuario.
 * @throws {Error} Si la validación falla.
 */
export const validateCreateUser = (data) => {
  const result = safeParse(RegisterSchema, data);
  if (!result.success) {
    const errorMessage = result.issues.map((issue) => issue.message).join(', ');
    throw new AppError(errorMessage, 400, result.issues);
  }
};

/**
 * Valida los datos para actualizar un usuario.
 * @param {Object} data - Datos a actualizar.
 * @throws {Error} Si la validación falla.
 */
export const validateUpdateUser = (data) => {
  const result = safeParse(UpdateUserSchema, data);
  if (!result.success) {
    const errorMessage = result.issues.map((issue) => issue.message).join(', ');
    throw new AppError(errorMessage, 400, result.issues);
  }
};


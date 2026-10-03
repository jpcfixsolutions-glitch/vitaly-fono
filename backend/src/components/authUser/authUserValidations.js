import { safeParse } from 'valibot';
import { LoginSchema } from './authUserSchema.js';
import { AppError } from "../../../errors.js";

/**
 * Valida los datos de inicio de sesión.
 * @param {Object} data - Datos de login (email, password).
 * @throws {Error} Si la validación falla.
 */
export const validateLogin = (data) => {
  const result = safeParse(LoginSchema, data);
  if (!result.success) {
    const errorMessage = result.issues.map((issue) => issue.message).join(', ');
    throw new AppError(errorMessage, 400, result.issues);
  }
};


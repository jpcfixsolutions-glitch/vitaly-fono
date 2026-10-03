import { sanitizeText } from "../../utils/sanitized.js";
import { isValidString } from "../../utils/validations.js";
import { AppError } from "../../../errors.js";

export const typeServiceValidations = (name, description, price) => {
  if (!name || !price) {
    throw new AppError("Faltan datos obligatorios para crear el registro de tipo de servicio", 400, []);
  }

  if (name && !isValidString(name)) {
    throw new AppError("El nombre no puede estar vacío", 400, []);
  }

  if (name.length < 5) {
    throw new AppError("El nombre debe tener al menos 5 caracteres", 400, []);
  }

  if (name.length > 50) {
    throw new AppError("El nombre no puede exceder 50 caracteres", 400, []);
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    throw new AppError("El monto es requerido y debe ser un número positivo", 400, []);
  }

  const sanitizedDescription = typeof description === 'string' && description.trim() !== ''
    ? sanitizeText(description, 255)
    : '';

  if (sanitizedDescription.length > 255) {
    throw new AppError("La descripción no puede exceder 255 caracteres", 400, []);
  }
}
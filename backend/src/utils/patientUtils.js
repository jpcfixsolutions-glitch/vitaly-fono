import { documentTypeService } from "../components/documentType/documentTypeService.js";
import { healthInsuranceService } from "../components/healthInsurance/healthInsuranceService.js";
import { userService } from "../components/user/userService.js";
import { sanitizeText } from "./sanitized.js";

/**
 * Valida que nombre/apellido contengan solo letras
 */
export const isValidNameOrLastName = (name) => {
  const trimmed = name.trim();
  if (typeof trimmed !== "string" || trimmed.length < 2 || trimmed.length > 50) {
    return false;
  }
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s'-]{2,50}$/;
  return nameRegex.test(trimmed);
};

/**
 * Valida si un número de teléfono tiene un formato válido.
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?\d{8,15}$/;
  return phoneRegex.test(phone.toString().replace(/[\s\-]/g, ""));
};

/**
 * Valida si una dirección de email tiene un formato válido.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un tipo de documento es válido.
 */
export const isValidDocumentType = async (typeId) => {
  if (!typeId) {
    return false;
  }

  const documentType = await documentTypeService.getDocumentTypeById(typeId);
  if (!documentType) {
    return false;
  }
  return true;
};

/**
 * Valida si un número de documento es válido según su tipo.
 */
export const isValidDocumentNumber = async (number, typeId) => {
  const documentType = await documentTypeService.getDocumentTypeById(typeId);

  if (!documentType) {
    return false;
  }

  const numStr = number.toString().trim();
  const typeName = documentType.name.toUpperCase();

  switch (typeName) {
    case "DNI":
      const dniResult = /^\d{7,8}$/.test(numStr);
      return dniResult;
    case "PASAPORTE":
      const pasaporteResult = /^[A-Z]{3}\d{6}$/.test(numStr) || /^\d{8,9}$/.test(numStr);
      return pasaporteResult;
    default:
      const defaultResult = numStr.length >= 6 && numStr.length <= 20;
      return defaultResult;
  }
};

/**
 * Valida si una obra social es válida.
 */
export const isValidHealthInsurance = async (healthInsuranceId) => {
  const healthInsurance = await healthInsuranceService.getHealthInsuranceById(healthInsuranceId);
  if (!healthInsurance) {
    return false;
  }
  return true;
};

/**
 * Valida si un usuario es válido.
 */
export const isValidUser = async (userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    return false;
  }
  return true;
};

export { sanitizeText };

/**
 * Valida que un valor sea string no vacío
 */
// Todo: quitar cuando se limpiea de todo el backend
export const isValidString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};
import { AppError } from "../../../errors.js";

export const healthInsuranceValidations = (name, id_user) => {
  if (!name || !id_user) {
    throw new AppError("Faltan datos obligatorios para crear la obra social", 400, []);
  }

  if (name.length < 3) {
    throw new AppError("El nombre debe tener al menos 3 caracteres", 400, []);
  }

  if (name.length > 50) {
    throw new AppError("El nombre no puede exceder 50 caracteres", 400, []);
  }
}
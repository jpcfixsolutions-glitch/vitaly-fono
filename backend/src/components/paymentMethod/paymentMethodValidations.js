import { userService } from "../user/userService.js";
import { AppError } from "../../../errors.js";

export const paymentMethodValidations = async (name, id_user) => {

  const existUser = await userService.getUserById(id_user);
  if (!existUser) {
    throw new AppError("No se encontró el usuario", 404, []);
  }

  if (!name || typeof name !== 'string') {
    throw new AppError("El nombre es requerido y debe ser un texto válido", 400, []);
  }

  if (name.length < 3) {
    throw new AppError("El nombre debe tener al menos 3 caracteres", 400, []);
  }

  if (name.length > 50) {
    throw new AppError("El nombre no puede exceder 50 caracteres", 400, []);
  }
}
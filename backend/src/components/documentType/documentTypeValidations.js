import { userService } from "../user/userService.js";
import { AppError } from "../../../errors.js";

export const documentTypeValidations = async (name, id_user) => {
  if (!name || !id_user) {
    throw new AppError("Faltan datos obligatorios para crear el registro de tipo de documento", 400, []);
  };

  const existsUser = await userService.getUserById(id_user);
  if (!existsUser) {
    throw new AppError("No se encontró el usuario", 404, []);
  }

  // ToDo: validar nombre del tipo de documento
}
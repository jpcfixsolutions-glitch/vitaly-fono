import { isValidAge, isValidString } from "../../utils/validations.js";
import { AppError } from "../../../errors.js";

// export const fatherValidations = (id_interview, father_name, father_age, father_lives, father_profession, father_work_hours) => {
//   if (!id_interview || !father_name || !father_age || father_lives === undefined || !father_profession || !father_work_hours) {
//     throw new AppError("Faltan datos obligatorios para crear el registro del padre", 400, []);
//   }

//   if (father_name && !isValidString(father_name)) {
//     throw new AppError("El nombre no puede estar vacío", 400, []);
//   }

//   if (father_age && !isValidAge(father_age)) {
//     throw new AppError("La edad no puede ser menor a 0", 400, []);
//   }

//   if (father_lives && !isValidString(father_lives)) {
//     throw new AppError("El estado de vida no puede estar vacío", 400, []);
//   }

//   if (father_profession && !isValidString(father_profession)) {
//     throw new AppError("La profesión o estudios no puede estar vacío", 400, []);
//   }

//   if (father_work_hours && !isValidString(father_work_hours)) {
//     throw new AppError("Los horarios de trabajo no pueden estar vacíos", 400, []);
//   }
// }

export const fatherValidations = (id_interview, father_name, father_age, father_lives, father_profession, father_work_hours) => {
  if (!id_interview) {
    throw new AppError("Faltan datos obligatorios para crear el registro del padre", 400, []);
  }

  if (father_name && !isValidString(father_name)) {
    throw new AppError("El nombre no puede estar vacío", 400, []);
  }

  if (father_age && !isValidAge(father_age)) {
    throw new AppError("La edad no puede ser menor a 0", 400, []);
  }

  if (father_lives && !isValidString(father_lives)) {
    throw new AppError("El estado de vida no puede estar vacío", 400, []);
  }

  if (father_profession && !isValidString(father_profession)) {
    throw new AppError("La profesión o estudios no puede estar vacío", 400, []);
  }

  if (father_work_hours && !isValidString(father_work_hours)) {
    throw new AppError("Los horarios de trabajo no pueden estar vacíos", 400, []);
  }
}
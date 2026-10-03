import { isValidAge, isValidString } from "../../utils/validations.js";
import { AppError } from "../../../errors.js";

/**
 * Valida los datos para crear o actualizar una madre.
 * 
 * @param {string} id_interview - ID de la entrevista.
 * @param {string} name - Nombre de la madre.
 * @param {string|number} age - Edad de la madre.
 * @param {boolean|number} lives - Si vive (1/0 o true/false).
 * @param {string} profession_studies - Profesión o estudios.
 * @param {string} work_hours - Horarios de trabajo.
 * @param {string} mode - Modo de validación ('create' o 'update').
 * @throws {Error} Si algún dato es inválido.
 */
// export const motherValidations = (id_interview, mother_name, mother_age, mother_lives, mother_profession, mother_work_hours) => {
//   if (!id_interview || !mother_name || !mother_age || mother_lives === undefined || !mother_profession || !mother_work_hours) {
//     throw new AppError("Faltan datos obligatorios para crear el registro de la madre", 400, []);
//   }

//   if (mother_name && !isValidString(mother_name)) {
//     throw new AppError("El nombre no puede estar vacío", 400, []);
//   }

//   if (mother_age && !isValidAge(mother_age)) {
//     throw new AppError("La edad no puede ser menor a 0", 400, []);
//   }

//   if (mother_profession && !isValidString(mother_profession)) {
//     throw new AppError("La profesión o estudios no puede estar vacío", 400, []);
//   }

//   if (mother_work_hours && !isValidString(mother_work_hours)) {
//     throw new AppError("Los horarios de trabajo no pueden estar vacíos", 400, []);
//   }
// };

export const motherValidations = (id_interview, mother_name, mother_age, mother_lives, mother_profession, mother_work_hours) => {
  if (!id_interview) {
    throw new AppError("Faltan datos obligatorios para crear el registro de la madre", 400, []);
  }

  if (mother_name && !isValidString(mother_name)) {
    throw new AppError("El nombre no puede estar vacío", 400, []);
  }

  if (mother_age && !isValidAge(mother_age)) {
    throw new AppError("La edad no puede ser menor a 0", 400, []);
  }

  if (mother_profession && !isValidString(mother_profession)) {
    throw new AppError("La profesión o estudios no puede estar vacío", 400, []);
  }

  if (mother_work_hours && !isValidString(mother_work_hours)) {
    throw new AppError("Los horarios de trabajo no pueden estar vacíos", 400, []);
  }
};
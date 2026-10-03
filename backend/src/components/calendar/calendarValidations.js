import { isValidDay } from "../../utils/date.js";
import { isValidTime, isValidTimeRange } from "../../utils/time.js";
import { AppError } from "../../../errors.js";

/**
 * Valida los campos para la creación o edición de un calendario.
 *
 * @param {string} day - Día de la semana a validar.
 * @param {string} start_time - Horario de inicio en formato HH:MM.
 * @param {string} end_time - Horario de fin en formato HH:MM.
 * @throws {Error} Si falta algún campo requerido, si el día no es válido,
 *                 si los horarios no son válidos o si el rango de horarios es incorrecto.
 */
export const calendarValidations = (day, start_time, end_time) => {
  if (!day || !start_time || !end_time) {
    throw new AppError("Los campos día, horario desde y horario hasta son requeridos", 400, []);
  }

  if (day && !isValidDay(day)) {
    throw new AppError("Debe ser un día de semana válido", 400, []);
  }

  if (start_time && !isValidTime(start_time)) {
    throw new AppError("Debe ser un horario de inicio válido, en formato HH:MM", 400, []);
  }

  if (end_time && !isValidTime(end_time)) {
    throw new AppError("Debe ser un horario de fin válido, en formato HH:MM", 400, []);
  }

  if (start_time && end_time && !isValidTimeRange(start_time, end_time)) {
    throw new AppError("El horario de inicio debe ser menor al horario de fin", 400, []);
  }
}
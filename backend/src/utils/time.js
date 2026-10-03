/**
 * Valida si una hora está en formato HH:MM y es una hora válida.
 * 
 * @param {string} time - La hora a validar en formato HH:MM (24 horas)
 * @returns {boolean} true si la hora es válida y está en formato correcto, false en caso contrario
 */
export const isValidTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}


/**
 * Valida si un rango de horarios es válido, es decir, que el horario de inicio sea menor al horario de fin.
 * 
 * @param {string} start_time - El horario de inicio en formato HH:MM
 * @param {string} end_time - El horario de fin en formato HH:MM
 * @returns {boolean} true si el rango de horarios es válido, false en caso contrario
 */
export const isValidTimeRange = (start_time, end_time) => {
  const [startHours, startMinutes] = start_time.split(':').map(Number);
  const [endHours, endMinutes] = end_time.split(':').map(Number);

  if (startHours < endHours) return true;
  if (startHours > endHours) return false;
  return startMinutes < endMinutes;
}
/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD.
 *
 * @returns {string} La fecha actual como cadena en formato 'YYYY-MM-DD'.
 */
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


/**
 * Parsea una cadena de fecha en un objeto Date.
 * Si la cadena es inválida o vacía, devuelve null.
 *
 * @param {string|Date} value - La cadena de fecha (formato YYYY-MM-DD, ISO, o similar) o un objeto Date.
 * @returns {Date|null} Objeto Date si el parseo fue exitoso, o null si la fecha es inválida.
 */
export const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
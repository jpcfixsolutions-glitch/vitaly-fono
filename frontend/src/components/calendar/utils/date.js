import { format } from "date-fns";

/**
 * Devuelve valores listos para inputs HTML a partir de una fecha inicial
 * @param {string|Date|null} initialDate - Fecha seleccionada en el calendario
 * @returns {{ dateInput: string, timeInput: string }}
 */
export function parseInitialDateToInputs(initialDate) {
  if (!initialDate) return { dateInput: "", timeInput: "" };
  const dateObj = new Date(initialDate);
  return {
    dateInput: format(dateObj, "yyyy-MM-dd"),
    timeInput: format(dateObj, "HH:mm"),
  };
}

/**
 * Combina fecha (yyyy-MM-dd) y hora (HH:mm) en una ISOString
 * @param {string} dateInput
 * @param {string} timeInput
 * @returns {string} ISOString
 */
export function toISOFromDateAndTime(dateInput, timeInput) {
  // Construye un string RFC3339 con hora local y offset (ej.: -03:00) para
  // que DB, API y UI muestren exactamente la misma hora elegida por el usuario.
  const [year, month, day] = dateInput.split('-').map(Number);
  const [hour, minute] = timeInput.split(':').map(Number);
  const local = new Date(year, month - 1, day, hour, minute, 0, 0);

  const pad = (n) => String(n).padStart(2, '0');
  const tzOffsetMinutes = -local.getTimezoneOffset(); // minutos respecto a UTC
  const sign = tzOffsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(tzOffsetMinutes);
  const offH = pad(Math.floor(abs / 60));
  const offM = pad(abs % 60);

  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${sign}${offH}:${offM}`;
}

/**
 * Formatea una fecha Date a texto en español (solo fecha)
 * @param {Date|null} date
 * @returns {string}
 */
export function formatDisplayDate(date) {
  return date ? date.toLocaleDateString('es-ES') : '';
}

/**
 * Formatea una fecha Date a texto en español (solo hora HH:mm)
 * @param {Date|null} date
 * @returns {string}
 */
export function formatDisplayTime(date) {
  return date ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
}



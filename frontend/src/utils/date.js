/**
 * Parsea una fecha en formato YYYY-MM-DD a formato DD/MM/YYYY
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @returns {Object} Objeto con la fecha parseada
 * @returns {string} dateParsed - Fecha en formato DD/MM/YYYY
 */
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function parseDate(date) {
  const [year, month, day] = date.split('-');

  const dateParsed = `${day}/${month}/${year}`;

  return {
    dateParsed
  }
};

/**
 * Convierte distintos formatos de fecha/fecha-hora a un objeto Date seguro.
 * Acepta: "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss", ISO con 'T', "DD/MM/YYYY" y Date.
 * Ancla a T12:00:00 cuando solo hay fecha para evitar desfases de TZ.
 * @param {string|Date} value
 * @returns {Date}
 */
export function parseToDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const str = String(value);
  try {
    if (str.includes(' ')) return new Date(str.replace(' ', 'T'));
    if (str.includes('T')) return new Date(str);
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(`${str}T12:00:00`);
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [dd, mm, yyyy] = str.split('/');
      return new Date(`${yyyy}-${mm}-${dd}T12:00:00`);
    }
    return new Date(str);
  } catch {
    return new Date();
  }
}

/**
 * Convierte distintos formatos de fecha a formato YYYY-MM-DD (requerido por inputs tipo date).
 * Soporta: "DD/MM/YYYY", "YYYY-MM-DD", objetos Date y otros formatos comunes.
 * 
 * @param {string|Date} dateLike - Fecha en cualquier formato
 * @returns {string} Fecha en formato YYYY-MM-DD o string vacío si no es válida
 */
export function toInputDate(dateLike) {
  if (!dateLike) return '';
  try {
    if (typeof dateLike === 'string') {
      // Soporta "DD/MM/YYYY" y "YYYY-MM-DD"
      if (dateLike.includes('/')) {
        const [dd, mm, yyyy] = dateLike.split('/');
        return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
      }
      if (dateLike.includes('-')) {
        // Ya está en formato YYYY-MM-DD, verificar que esté bien formateado
        const [yyyy, mm, dd] = dateLike.split('-');
        return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
      }
    }
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return '';
  }
}

/**
 * Extrae "HH:mm" desde una cadena de fecha-hora.
 * Acepta: "YYYY-MM-DD HH:mm:ss" e ISO con 'T'. 
 * IMPORTANTE: Extrae la hora directamente del string para evitar problemas de zona horaria.
 * Si el string viene en UTC (con 'Z' o '+00:00'), se mantiene la hora original.
 * @param {string} value
 * @returns {string}
 */
export function extractTimeString(value) {
  if (!value || typeof value !== 'string') return '00:00';
  try {
    // Formato: "YYYY-MM-DD HH:mm:ss"
    if (value.includes(' ')) {
      return value.split(' ')[1]?.slice(0, 5) || '00:00';
    }
    // Formato ISO: "YYYY-MM-DDTHH:mm:ss" o "YYYY-MM-DDTHH:mm:ssZ" o "YYYY-MM-DDTHH:mm:ss+00:00" o "YYYY-MM-DDTHH:mm:ss-03:00"
    if (value.includes('T')) {
      // Extraer la parte de tiempo directamente del string, sin conversión de zona horaria
      const timePart = value.split('T')[1];
      if (!timePart) return '00:00';
      
      // Remover zona horaria si existe (Z, +00:00, -03:00, etc.)
      // Usamos una regex más precisa para capturar el formato completo
      const timeOnly = timePart.replace(/[Z+-]\d{2}:\d{2}$|[Z+-]\d{4}$|[Z+-]\d{2}$/, '').split('.')[0];
      
      // Extraer HH:mm (puede venir como HH:mm:ss o HH:mm:ss.sss)
      const timeMatch = timeOnly.match(/^(\d{2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`;
      }
      
      // Fallback: intentar con Date pero usando UTC para mantener la hora original
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        // Usar métodos UTC para mantener la hora original del string
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mm = String(d.getUTCMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
      }
    }
    return '00:00';
  } catch {
    return '00:00';
  }
}

/**
 * Extrae la hora (HH:mm) desde una cadena de fecha-hora en formato ISO (YYYY-MM-DDTHH:mm:ss).
 * Versión simplificada para strings ISO con 'T'.
 * @param {string} dateTimeString - Fecha-hora en formato ISO (YYYY-MM-DDTHH:mm:ss)
 * @returns {string} Hora en formato HH:mm o '00:00' si no es válida
 */
export function extractTime(dateTimeString) {
  if (!dateTimeString) return '00:00';
  try {
    if (dateTimeString.includes('T')) {
      const timePart = dateTimeString.split('T')[1];
      if (!timePart) return '00:00';
      const timeParts = timePart.split(':');
      const hours = timeParts[0] || '00';
      const minutes = timeParts[1] || '00';
      return `${hours}:${minutes}`;
    }
    return '00:00';
  } catch {
    return '00:00';
  }
}

/**
 * Extrae la fecha y la convierte a formato DD/MM/YYYY desde una cadena de fecha-hora en formato ISO.
 * @param {string} dateTimeString - Fecha-hora en formato ISO (YYYY-MM-DDTHH:mm:ss) o YYYY-MM-DD
 * @returns {string} Fecha en formato DD/MM/YYYY o string vacío si no es válida
 */
export function extractDate(dateTimeString) {
  if (!dateTimeString) return '';
  try {
    const datePart = dateTimeString.includes('T') 
      ? dateTimeString.split('T')[0] 
      : dateTimeString.split(' ')[0] || dateTimeString;
    
    const dateParts = datePart.split('-');
    if (dateParts.length !== 3) return '';
    
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

/**
 * Formatea una fecha a formato largo en español (ej: "12 de octubre de 2023").
 * @param {string|Date} dateStr - Fecha a formatear
 * @returns {string} Fecha formateada o '-' si es inválida
 */
export function formatDateLong(dateStr) {
  try {
    if (!dateStr) return '-';
    const d = parseToDate(dateStr);
    return isNaN(d.getTime()) ? '-' : format(d, "dd 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return '-';
  }
}

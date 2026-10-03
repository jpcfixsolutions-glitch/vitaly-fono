/**
 * Sanitiza y normaliza una cadena de texto, eliminando espacios adicionales y recortando su longitud.
 *
 * Esta función toma un texto de entrada y realiza los siguientes pasos:
 *   - Si el valor no es de tipo string, retorna una cadena vacía.
 *   - Elimina espacios al inicio y al final del texto.
 *   - Sustituye cualquier secuencia de espacios en blanco (incluidos saltos de línea y tabulaciones) 
 *     por un solo espacio en blanco.
 *   - Recorta el texto al número máximo de caracteres indicados en maxLength.
 *
 * Es útil para limpiar datos de entrada antes de almacenarlos o procesarlos,
 * garantizando que los textos sean consistentes y no excedan una longitud definida.
 * 
 * @param {string} text - Texto a sanitizar y normalizar.
 * @param {number} [maxLength=100] - Longitud máxima permitida. El texto se recortará a este límite.
 * @returns {string} El texto sanitizado, sin espacios extra y truncado según el largo máximo.
 */
export const sanitizeText = (text, maxLength = 100) => {
  if (typeof text !== "string") return "";
  return text.trim().replace(/\s+/g, " ").substring(0, maxLength);
};
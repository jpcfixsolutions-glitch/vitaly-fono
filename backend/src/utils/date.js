
/**
 * Convierte una fecha del formato DD/MM/YYYY al formato YYYY-MM-DD para base de datos.
 * Si la fecha ya está en formato YYYY-MM-DD, la retorna sin modificaciones.
 * 
 * @param {string} dateString - La fecha en formato DD/MM/YYYY o YYYY-MM-DD
 * @returns {string} La fecha en formato YYYY-MM-DD para almacenamiento en base de datos
 */
export const formatDateForDB = (dateString) => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateString;
}

/**
 * Valida si una fecha es válida y está en uno de los formatos aceptados.
 * Acepta fechas en formato DD/MM/YYYY o YYYY-MM-DD y verifica que sea una fecha real
 * posterior al año 1900.
 * 
 * @param {string} date - La fecha a validar en formato DD/MM/YYYY o YYYY-MM-DD
 * @returns {boolean} true si la fecha es válida y está en formato correcto, false en caso contrario
 */
export const isValidDate = (date) => {
  const dateRegexDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/;
  const dateRegexYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegexDDMMYYYY.test(date) && !dateRegexYYYYMMDD.test(date)) {
    return false;
  }

  const parsedDate = new Date(formatDateForDB(date));
  return (
    parsedDate instanceof Date &&
    !isNaN(parsedDate) &&
    parsedDate.getFullYear() >= 1900
  );
};


/**
 * Valida si un día es válido y está en la lista de días permitidos.
 * 
 * @param {string} day - El día a validar en formato string
 * @returns {boolean} true si el día es válido y está en la lista de días permitidos, false en caso contrario
 */
export const isValidDay = (day) => {
  const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  return days.includes(day.toLowerCase());
}

/**
 * Retorna la fecha y hora actual formateada como una cadena ISO local (YYYY-MM-DDTHH:mm:ss).
 * 
 * Esta función genera una cadena de texto que representa la fecha y hora actual del sistema,
 * utilizando la hora local del servidor y ajustando los valores para asegurar siempre dos dígitos
 * en el mes, día, hora, minuto y segundo. El formato resultante sigue el estándar ISO 8601 sin zona horaria explícita,
 * usando el carácter 'T' como separador entre la fecha y la hora.
 *
 * Es útil para registrar marcas de tiempo consistentes en bases de datos, logs o para mostrar
 * fechas estandarizadas en la aplicación.
 *
 * @returns {string} Cadena en formato YYYY-MM-DDTHH:MM:SS representando la fecha y hora local actual.
 */
export const getCurrentDate = () => {
  const options = {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  // 2. Usamos Intl.DateTimeFormat para obtener las partes de la fecha local
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(new Date());
  
  // 3. Extraemos los valores para armar el string manualmente
  const getPart = (type) => parts.find(p => p.type === type).value;

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hours = getPart('hour');
  const minutes = getPart('minute');
  const seconds = getPart('second');

  // const now = new Date();
  // const pad = (n) => String(n).padStart(2, '0');
  // const year = now.getFullYear();
  // const month = pad(now.getMonth() + 1);
  // const day = pad(now.getDate());
  // const hours = pad(now.getHours());
  // const minutes = pad(now.getMinutes());
  // const seconds = pad(now.getSeconds());

  // Formato con T: YYYY-MM-DDTHH:MM:SS (hora local)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
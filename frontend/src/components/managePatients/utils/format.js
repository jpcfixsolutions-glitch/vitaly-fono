/**
 * Transforma fecha de DD/MM/YYYY a YYYY-MM-DD si es necesario.
 * 
 * @param {string} dateString - Fecha en string.
 * @returns {string} - Fecha formateada YYYY-MM-DD o string vacío.
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';

  // Si ya está en formato YYYY-MM-DD, devuelve como está
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // Si es DD/MM/YYYY, convierte a YYYY-MM-DD
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  return dateString;
};

/**
 * Formatea una fecha YYYY-MM-DD a DD/MM/YYYY para visualización.
 * @param {string} dateString 
 * @returns {string} Fecha formateada o '-'
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return '-';
  // Asume formato ISO o con guiones YYYY-MM-DD
  if (typeof dateString === 'string' && dateString.includes('-')) {
    // Si viene con hora, cortamos
    const cleanDate = dateString.split('T')[0];
    return cleanDate.split('-').reverse().join('/');
  }
  return dateString;
};


export const formatTimeDisplay = (timeString) => {
  if (!timeString) return '-';
  return timeString.split('T')[1].split(':').slice(0, 2).join(':');
};
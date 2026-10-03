import { parseToDate } from '../../../utils';

/**
 * Verifica si una sesión ya ocurrió (si su fecha y hora es menor o igual a la fecha/hora actual)
 * @param {Object} params - Parámetros de la función
 * @param {boolean} params.isInterview - Indica si el item es una entrevista
 * @param {string} params.sessionDate - Fecha de la sesión (puede incluir fecha y hora)
 * @returns {boolean} true si la sesión ya pasó, false en caso contrario
 */
export const isSessionActive = ({ isInterview, sessionDate }) => {
  if (isInterview) return false;
  
  if (!sessionDate) return false;

  const sessionDateParsed = parseToDate(sessionDate);
  const now = new Date();
  
  return now.getTime() >= sessionDateParsed.getTime();
};

import { extractDate, extractTime } from '../../../utils';

/**
 * Procesa los datos de entrevista para crear un item de línea de tiempo
 * @param {Object} interview - Objeto de entrevista
 * @returns {Object|null} Item de entrevista formateado o null si no hay entrevista
 */
export const processInterviewItem = (interview) => {
  if (!interview) return null;

  return {
    id: `${interview.interview.id}`,
    date_parsed: extractDate(interview.interview.date),
    time_parsed: extractTime(interview.interview.date),
    tipo: 'entrevista',
    data: interview
  };
};

/**
 * Procesa las sesiones para crear items de línea de tiempo
 * @param {Array} sessions - Array de sesiones
 * @returns {Array} Array de items de sesión ordenados por fecha (más reciente primero)
 */
export const processSessionItems = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) return [];

  return sessions
    .map((session, index) => ({
      id: `${session.id}`,
      date: session.session_date,
      date_parsed: extractDate(session.session_date),
      time_parsed: extractTime(session.session_date),
      updated_at: session.updated_at,
      created_at: session.created_at,
      status: session.status,
      id_user: session.id_user,
      id_turn: session.id_turn,
      id_service: session.id_service,
      id_patient: session.id_patient,
      clinical_notes: session.clinical_notes,
      tipo: 'sesion', // Unificamos 'type' a 'tipo' para consistencia con TimelineItem
      data: session,  // <--- Agregamos la sesión completa en 'data' para que TimelineItem la pueda pasar al handler
      sessionNumber: index + 1,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const processDischargeItems = (discharges) => {
  if (!discharges || !Array.isArray(discharges)) return [];

  return discharges
    .map((discharge, index) => ({
      id: `${discharge.id}`,
      date: discharge.date,
      date_parsed: extractDate(discharge.date),
      time_parsed: extractTime(discharge.date),
      updated_at: discharge.updated_at,
      created_at: discharge.created_at,
      status: discharge.status,
      id_user: discharge.id_user,
      id_patient: discharge.id_patient,
      tipo: discharge.type === 'Reactivación del tratamiento' ? 'reactivacion' : 'cierre',
      data: discharge,
      sessionNumber: index + 1,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Combina y procesa todos los items de la línea de tiempo
 * @param {Object} interview - Objeto de entrevista
 * @param {Array} sessions - Array de sesiones
 * @returns {Array} Array de items de línea de tiempo combinados
 */
export const processTimelineItems = (interview, sessions, discharges) => {
  const interviewItem = processInterviewItem(interview);
  const sessionItems = processSessionItems(sessions);
  const dischargeItems = processDischargeItems(discharges);

  // Combinamos sesiones y cierres, y los ordenamos por fecha descendente (más reciente primero)
  const otherItems = [...sessionItems, ...dischargeItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const timelineItems = [...otherItems];

  if (interviewItem) {
    timelineItems.push(interviewItem);
  }

  return timelineItems;
};

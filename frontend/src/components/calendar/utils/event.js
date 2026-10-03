/**
 * Mapeo de estados a colores para los eventos del calendario
 */
const statusColors = {
  // Programado
  Activo: 'var(--turno-activo)',
  Otorgado: 'var(--turno-activo)',
  Programado: 'var(--turno-activo)',
  // Notificado
  Notificado: 'var(--turno-pendiente-confirmacion)',
  Pendiente_confirmacion: 'var(--turno-pendiente-confirmacion)',
  Pendiente_confirmación: 'var(--turno-pendiente-confirmacion)',
  // Confirmado
  Confirmado: 'var(--turno-confirmado)',
  // Cancelado
  Cancelado: 'var(--turno-cancelado)',
  default: 'var(--turno-default)'
};

/**
 * Transforma un objeto de evento del backend al formato que requiere FullCalendar.
 * 
 * @param {Object} event - Objeto de evento recibido desde el backend.
 * @param {string|number} event.id - ID del evento.
 * @param {string} event.name - Nombre del paciente.
 * @param {string} event.last_name - Apellido del paciente.
 * @param {string} [event.phone] - Teléfono del paciente.
 * @param {string} [event.modality] - Modalidad del turno (ej: 'presencial', 'online').
 * @param {string|Date|number} [event.date] - Fecha y hora del turno (puede ser string, Date o timestamp).
 * @param {string|Date|number} [event.start] - Alternativamente, campo start si viene del form/calendar (opcional).
 * @param {string} event.status - Estado del turno (ej: 'Activo', 'Cancelado', etc).
 * @returns {Object} Objeto formateado para ser consumido por FullCalendar.
 * @returns {string|number} return.id - ID del evento.
 * @returns {string} return.title - Nombre y apellido concatenados del paciente.
 * @returns {Date|string|number} return.start - Fecha/hora en formato compatible con FullCalendar.
 * @returns {string} return.color - Color asociado al estado.
 * @returns {Object} return.extendedProps - Propiedades adicionales del evento.
 */
export function formatEventForCalendar(event) {
  const eventColor = statusColors[event.status] || statusColors.default;

  // Normalizar fecha a un objeto Date o ISO válido
  const normalizeStart = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);
    if (typeof value === 'string') {
      // Si viene con espacio entre fecha y hora, reemplazar por 'T'
      const candidate = value.includes(' ') && !value.includes('T') ? value.replace(' ', 'T') : value;
      const d = new Date(candidate);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const start = normalizeStart(event.date) || normalizeStart(event.start) || event.date || event.start;

  return {
    id: event.id,
    title: `${event.name} ${event.last_name}`,
    start,
    color: eventColor,
    extendedProps: {
      phone: event.phone,
      modality: event.modality,
      name: event.name,
      last_name: event.last_name,
      status: event.status,
      psychologist_name: event.psychologist_name,
      id_user: event.id_user,
    },
  };
}

/**
 * Normaliza un objeto de formulario o evento a payload del backend
 * Acepta tanto objetos de FullCalendar como del form
 */
export function formatEventForBackend(event) {
  return {
    name: event.name || event.title?.split(' ')[0] || '',
    last_name: event.last_name || event.title?.split(' ').slice(1).join(' ') || '',
    phone: event.phone || '',
    modality: event.modality || 'presencial',
    date: event.start || event.date,
  };
}



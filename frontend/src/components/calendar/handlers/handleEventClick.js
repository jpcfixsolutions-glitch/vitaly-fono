import { openModal } from "../../../utils";
import { formatDisplayDate, formatDisplayTime } from "../utils";

/**
 * Maneja el clic en un evento del calendario.
 * Retorna una función que FullCalendar invocará con los datos del clic.
 * 
 * @param {Object} clickInfo - Objeto que contiene los datos del clic.
 * @param {Object} event - Objeto de evento.
 * @param {Object} clickInfo.event - Objeto de evento.
 * @param {Date|string|number} clickInfo.event.start - Fecha y hora del evento.
 * @param {Object} clickInfo.event.extendedProps - Propiedades adicionales del evento.
 * @param {Function} setSelectedEvent - Función para actualizar el estado con los datos del evento.
 * @returns {void}
 */
export const handleEventClick = (setSelectedEvent) => (clickInfo) => {
  const { event } = clickInfo;
  const { start, extendedProps } = event;
  const fechaStr = formatDisplayDate(start);
  const horaStr = formatDisplayTime(start);

  setSelectedEvent({ id: event.id, fechaStr, horaStr, ...extendedProps });
  openModal('eventDetailModal');
};
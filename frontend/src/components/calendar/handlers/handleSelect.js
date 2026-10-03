import { openModal } from "../../../utils";

/**
 * Maneja la selección de una fecha y hora en el calendario.
 * Retorna una función que FullCalendar invocará con los datos de la selección.
 * 
 * @param {Function} setSelectedDateTime - Función para actualizar el estado con la fecha seleccionada.
 * @returns {Function} Función manejadora del evento de selección.
 */
export const handleSelectCell = (setSelectedDateTime) => ({ start, view }) => {
  // Prevenir que se ejecute múltiples veces en mobile
  if (!start) return;

  setSelectedDateTime(start);
  openModal('registrarTurnoModal');
  view.calendar.unselect();
};

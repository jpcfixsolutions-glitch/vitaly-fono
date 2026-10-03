import { useState } from "react";

/**
 * Custom hook para configurar la vista del calendario según el tamaño de pantalla (mobile o desktop).
 * 
 * - Detecta si se está en un dispositivo móvil usando 'window.matchMedia'.
 * - Devuelve configuraciones especiales para FullCalendar dependiendo del tipo de dispositivo (mobile o desktop).
 *
 * @returns {{
 *   isMobile: boolean,
 *   views: object|undefined,
 *   initialView: string,
 *   headerToolbar: {
 *     left: string,
 *     center: string,
 *     right: string
 *   },
 *   eventContent: function
 * }}
 */
export const useMobile = () => {
  /**
   * Bandera que indica si la pantalla es de tamaño móvil (<= 768px).
   * @type {boolean}
   */
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });

  /**
   * Configuración de vistas para FullCalendar. En mobile, muestra 3 días de vista de grilla horaria.
   * @type {object|undefined}
   */
  const views = isMobile
    ? {
      timeGridThreeDay: {
        type: 'timeGrid',
        duration: { days: 3 },
      },
    }
    : undefined;

  /**
   * Vista inicial del calendario (‘timeGridThreeDay’ para mobile, ‘timeGridWeek’ para desktop).
   * @type {string}
   */
  const initialView = isMobile ? 'timeGridThreeDay' : 'timeGridWeek';

  /**
   * Configuración de la barra de herramientas del calendario.
   * @type {object}
   */
  const headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: isMobile ? 'timeGridThreeDay,timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay',
  };

  /**
   * Función para renderizar el contenido de los eventos en el calendario.
   * Renderiza el nombre y apellido, o el título o 'Turno' si no hay datos.
   * 
   * @param {object} arg - Argumento proporcionado por FullCalendar, contiene el evento.
   * @param {object} arg.event - Objeto de evento de FullCalendar.
   * @returns {object} Objeto con propiedad 'html' para renderización.
   */
  const eventContent = (arg) => {
    const { event } = arg;
    const { name, last_name } = event?.extendedProps || {};
    const text = isMobile
      ? (name ? `${name} ${last_name}` : (event.title || 'Turno'))
      : (name && last_name ? `${name} ${last_name}` : (event.title || 'Turno'));
    return { html: `<div class="fc-event-title">${text}</div>` };
  };

  return { isMobile, views, initialView, headerToolbar, eventContent };
}

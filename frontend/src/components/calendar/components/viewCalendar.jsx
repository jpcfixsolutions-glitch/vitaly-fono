import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Loading } from '../../ui/loading/loading.jsx';
import { MessageError } from '../../ui/error/MessageError.jsx';
import { hasValidBusinessHours } from '../utils/validations.js';
import { useMobile } from '../hooks';

export const ViewCalendar = ({
  apiLoadingTurns,
  apiErrorTurns,
  apiLoadingConfigurations,
  apiErrorConfigurations,
  events,
  businessHours,
  formatEventForCalendar,
  handleSelect,
  handleEventClick,
}) => {
  // Hook para configurar la vista del calendario según el tamaño de pantalla (mobile o desktop).
  const { isMobile, views, initialView, headerToolbar, eventContent } = useMobile();

  // Validamos los horarios de atención para impedir seleccionar celdas fuera de los horarios de atención.
  // Si constraint es undefined, no se aplican restricciones y se permiten acciones fuera de los horarios definidos.
  // Si constraint es 'businessHours', se aplican restricciones y se impiden acciones fuera de los horarios definidos.
  const constraint = hasValidBusinessHours(businessHours);

  const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  return (
    <>
      <div className="calendar-wrapper">
        {(apiLoadingTurns || apiLoadingConfigurations) && <Loading className="table-container-loading" />}

        {(apiErrorTurns || apiErrorConfigurations) && !apiLoadingTurns && !apiLoadingConfigurations && (!String(apiErrorTurns).includes('encontraron')) && <MessageError message="Ocurrió un error al cargar los datos de la agenda." className="text-danger" />}

        {!(apiLoadingTurns || apiLoadingConfigurations) && (!apiErrorTurns || (String(apiErrorTurns).includes('encontraron'))) && !apiErrorConfigurations && (
          <>
            <a href="/configuracion#calendario" className="configure-calendar-link">Ir a configuración del calendario<i className="fa-regular fa-share-from-square"></i></a>
            <FullCalendar
              themeSystem="bootstrap5"
              plugins={plugins}
              firstDay={1}
              initialView={initialView}
              views={views}
              headerToolbar={headerToolbar}
              slotDuration={'00:30:00'}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
              }}
              slotMinTime={'07:00'}
              slotMaxTime={'23:00'}
              allDaySlot={false}
              selectable={true}
              hiddenDays={[]}
              businessHours={businessHours}
              select={handleSelect}
              selectConstraint={constraint}
              eventConstraint={constraint}
              selectMirror={true}
              // Configuraciones para mejorar la detección de taps en mobile
              selectMinDistance={isMobile ? 5 : 0}
              longPressDelay={isMobile ? 200 : 1000}
              selectOverlap={false}
              dayMaxEvents={true}
              weekends={true}
              events={events.map(formatEventForCalendar)}
              eventClick={handleEventClick}
              eventContent={eventContent}
              height="auto"
              buttonText={{
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                // Etiquetamos la vista de 3 días como "Semana" en móvil
                timeGridThreeDay: 'Semana',
              }}
              locale="es"
              timeZone="local"
            />
          </>
        )}
      </div>
      
    </>
  );
};



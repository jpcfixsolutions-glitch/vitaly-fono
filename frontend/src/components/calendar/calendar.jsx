import { useState } from 'react';

import { useCalendar, useUpdateTurn, useTurnSubmit } from './hooks';
import { getBusinessHours, buildInitialValuesFromSelection, formatEventForCalendar } from './utils';
import { RegistrarTurnoForm, ViewCalendar, ViewEventDetail } from './components';
import { handleSelectCell, handleEventClick } from './handlers';

import { ModalPost, ModalGet } from '../modal';
import { useGetDocumentTypes, useGet } from '../../hooks';
import { useAuth } from '../../context/useAuth';

import { Section } from '../layout/section/index.js';
import { Container } from '../layout/container/container.jsx';
import { transformSelectOptions } from '../../utils/selectOptions.js';

import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { openModal } from '../../utils';

import './calendar.css';

const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const { user } = useAuth();
  const isReception = user?.role === 'Recepción';

  const { dataGet: usersData, loading: apiLoadingUsers } = useGet({
    url: '/usuarios',
    method: 'GET',
    autoFetch: isReception,
    needFilterByUser: false,
  });
  
  const usersList = Array.isArray(usersData?.data) ? usersData.data : [];
  const speechTherapistsList = usersList.filter(u => u.role === 'Fonoaudiólogo/a');
  const transformedUsers = transformSelectOptions(
    speechTherapistsList.map(u => ({ ...u, full_name: `${u.name} ${u.last_name}` })),
    'full_name'
  );

  // Hook para obtener los datos de la agenda, tanto turnos como configuraciones del calendario. Se obtiene el estado de carga y los errores de las peticiones para luego mostrarlos en la interfaz de usuario.
  const { 
    events, 
    apiLoadingGetTurns, 
    apiErrorGetTurns, 
    apiLoadingGetConfigurations, 
    apiErrorGetConfigurations,
    parsedConfigurationCalendarData
  } = useCalendar();

  // Hook para obtener los tipos de documentos para el formulario de registro de turno.
  // Esto es para que el select de documentos tenga las opciones disponibles.
  const { documentTypes } = useGetDocumentTypes();
  const transformedDocumentTypes = transformSelectOptions(documentTypes);

  // Valores iniciales para el formulario de registro de turno, para que se muestren en el formulario cuando se abre la modal.
  // Esto es porque sino no muestra el value de la fecha y la hora seleccionada.
  const initialValues = buildInitialValuesFromSelection(selectedDateTime);

  // Hook para manejar la lógica del post del turno y del paciente.
  const { 
    onSubmitTurn, 
    validatingFormData, 
    errorMessage, 
    successMessage, 
    apiLoadingPostTurn, 
    apiErrorPostTurn,
    apiLoadingPostPatient, 
    apiErrorPostPatient 
  } = useTurnSubmit();

  // Hook para manejar la lógica de actualización del estado del turno.
  const { 
    updateTurn,
    loading: apiLoadingUpdateTurn, 
    updatingStatus,
    updateError,
  } = useUpdateTurn(selectedEvent, setSelectedEvent);

  const handleOpenNewTurn = () => {
    setSelectedDateTime(null);
    openModal('registrarTurnoModal');
  };

  return (
    <Container className="calendar-container">
      <Section
        Icon={CalendarIcon}
        title="Gestión de Agenda"
        description="Organiza tu disponibilidad y gestiona las citas de tus pacientes de manera centralizada"
        actions={
          <button type="button" className="btn-new-turn" onClick={handleOpenNewTurn}>
            <Plus size={18} />
            Nuevo turno
          </button>
        }
      />

      <ViewCalendar
        apiLoadingTurns={apiLoadingGetTurns}
        apiErrorTurns={apiErrorGetTurns}
        apiLoadingConfigurations={apiLoadingGetConfigurations}
        apiErrorConfigurations={apiErrorGetConfigurations}
        events={events}
        businessHours={isReception ? [] : getBusinessHours(parsedConfigurationCalendarData)}
        formatEventForCalendar={formatEventForCalendar}
        handleSelect={handleSelectCell(setSelectedDateTime)}
        handleEventClick={handleEventClick(setSelectedEvent)}
      />

      <ModalPost
        id="registrarTurnoModal"
        title="Registrar turno"
        formId="registrarTurnoForm"
        loading={apiLoadingPostTurn || apiLoadingPostPatient || validatingFormData}
      >
        <RegistrarTurnoForm
          idModal="registrarTurnoModal"
          formId="registrarTurnoForm"
          onSubmit={onSubmitTurn}
          loading={apiLoadingPostTurn || apiLoadingPostPatient || validatingFormData}
          error={apiErrorPostTurn || apiErrorPostPatient}
          errorMessage={errorMessage}
          successMessage={successMessage}
          initialValues={initialValues}
          documentTypes={transformedDocumentTypes}
          users={transformedUsers}
          isReception={isReception}
        />
      </ModalPost>

      <ModalGet
        id="eventDetailModal"
        title="Detalle del turno"
      >
        <ViewEventDetail
          selectedEvent={selectedEvent}
          onChangeStatus={updateTurn}
          loading={updatingStatus || apiLoadingUpdateTurn}
          errorMessage={updateError}
        />
      </ModalGet>
    </Container>
  );
};

export { Calendar };

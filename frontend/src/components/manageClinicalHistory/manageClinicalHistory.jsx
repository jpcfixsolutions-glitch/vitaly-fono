import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Section, Container, useGetAllPatients, ModalPost, ModalUpdate, ModalGet } from '..';
import { FileText } from 'lucide-react';
import { openModal } from '../../utils';
import './manageClinicalHistory.css';
import { useGetFirstInterviewByPatient } from './hooks/useGetFirstInterviewByPatient';
import { useGetSession } from '../../hooks/useGetSession';
import { useGetTreatmentClosure, useFilteredPatients, useAutoSelectPatient } from './hooks';
import { useGetAllFirstInterviews } from './hooks/useGetAllFirstInterviews';
import { getUser } from '../../utils/getUser';
import { PanelPatients } from './components/panelPatients';
import { useSubmitPostFirstInterview } from './hooks/useSubmitPostFirstInterview';
import { FormFirstInterview } from './components/FormFirstInterview';
import { FormFirstInterview as FormFirstInterviewAdult } from './components/FormFirstInterviewForAdults';
import { RightPanel } from './components/RightPanel.jsx';
import { ViewInterviewModal } from './components/ViewInterviewModal';
import { useSubmitUpdateFirstInterview } from './hooks/useSubmitUpdateFirstInterview';
import { mapInterviewToFormValues } from './utils/mapInterviewToFormValues';
import { useSubmitUpdateSession } from './hooks/useSubmitUpdateSession';
import { FormSession } from './components/FormSession';
import { handleEditSession } from './handlers/handleEditSession';
import { useSubmitDischarge } from './hooks/useSubmitDischarge';
import { useReactivateTreatment } from './hooks/useReactivateTreatment';
import { FormDischarge } from './components/FormDischarge.jsx';
import { FormReactivateTreatment } from './components/FormReactivateTreatment';
import { ViewInterviewForAdultsModal } from './components/ViewInterviewForAdultsModal.jsx';
import { useSubmitUpdateFirstInterviewForAdults } from './hooks/useSubmitUpdateFirstInterviewForAdults.js';

export const ManageClinicalHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const externalSelectedPatientId = location?.state?.selectedPatientId || null;
  const externalPatientStatus = location?.state?.patientStatus;

  // Determinar filtro inicial basado en el estado del paciente si viene desde otra página
  const initialStatusFilter = (externalPatientStatus === 'Inactivo' || externalPatientStatus === false) ? 'inactive' : 'active';
  
  // Estados de filtrado (activos o inactivos) y búsqueda (por nombre)
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter); 
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para almacenar informacion del paciente seleccionado
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { 
    interview: patientInterview, 
    loading: loadingInterviewByPatientSelected, 
    error: errorInterviewByPatientSelected, 
    refetch: refetchInterviewByPatientSelected 
  } = useGetFirstInterviewByPatient(selectedPatient?.id);

  const resolveInterviewType = (patientId, interviewData) => {
    if (!patientId) return 'child';

    try {
      const storedType = localStorage.getItem(`firstInterviewType:${patientId}`);
      if (storedType === 'adult' || storedType === 'child') {
        return storedType;
      }
    } catch (error) {
      console.warn('No se pudo leer la preferencia del tipo de entrevista:', error);
    }

    const interviewType = interviewData?.interview_type || interviewData?.type || interviewData?.first_interview_type;
    if (interviewType === 'adult' || interviewType === 'child') {
      return interviewType;
    }

    const adultLikeFields = [
      'civil_status',
      'second_phone',
      'living_with',
      'profession',
      'derivation',
      'has_had_therapy',
      'therapy_duration',
      'reason_for_leaving_therapy',
      'current_therapy_type',
      'pathologies_diseases',
      'medication',
      'substance_alcohol_consumption',
      'hobbies_sports',
      'negative_thoughts',
      'abuse_mistreatment',
    ];

    const hasAdultSpecificValue = adultLikeFields.some((field) => Boolean(interviewData?.[field] || interviewData?.additional_patient_information?.[field] || interviewData?.adult_antecedents_additional_info?.[field]));

    return hasAdultSpecificValue ? 'adult' : 'child';
  };

  const [selectedInterviewType, setSelectedInterviewType] = useState('child');

  useEffect(() => {
    if (!selectedPatient?.id) {
      setSelectedInterviewType('child');
      return;
    }

    const nextType = resolveInterviewType(selectedPatient.id, patientInterview);
    setSelectedInterviewType(nextType);
  }, [selectedPatient?.id, patientInterview]);

  const handleInterviewTypeChange = (nextType) => {
    if (!selectedPatient?.id) return;

    const normalizedType = nextType === 'adult' ? 'adult' : 'child';
    setSelectedInterviewType(normalizedType);

    try {
      localStorage.setItem(`firstInterviewType:${selectedPatient.id}`, normalizedType);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia del tipo de entrevista:', error);
    }
  };
  
  // Estado para almacenar la sesión que se está editando
  const [editingSession, setEditingSession] = useState(null);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setSelectedPatient(null);
  };

  // Hook personalizado para obtener la lista de pacientes
  const { 
    dataPatient, 
    loading: apiLoadingGetPatient, 
    error: apiErrorGetPatient 
  } = useGetAllPatients();

  // Hook personalizado para obtener las sesiones (se combinan en useFilteredPatients)
  const { 
    sessions: dataSessions, 
    loading: apiLoadingGetSessions, 
    error: apiErrorGetSessions 
  } = useGetSession({
    url: "/sesion",
    method: "GET",
    autoFetch: true
  });

  // Hook personalizado para obtener todas las primeras entrevistas del usuario logueado
  const {
    dataInterviews,
    loading: apiLoadingGetInterviews,
    error: apiErrorGetInterviews
  } = useGetAllFirstInterviews(getUser()?.id);

  // Hook personalizado para filtrar pacientes
  const filteredPatients = useFilteredPatients({
    dataPatient,
    dataSessions,
    dataInterviews,
    searchTerm,
    statusFilter,
  });

  const {
    dataTreatmentClosure,
    loading: apiLoadingGetTreatmentClosure,
    error: apiErrorGetTreatmentClosure
  } = useGetTreatmentClosure();

  const loadingGetsData = 
    apiLoadingGetPatient || 
    apiLoadingGetSessions || 
    apiLoadingGetInterviews || 
    apiLoadingGetTreatmentClosure;

  const isReadOnly = statusFilter === 'inactive';

  // Hook personalizado para crear un nuevo paciente
  const { 
    successMessage,
    errorMessage,
    isLoading: isLoadingPostFirstInterview,
    apiLoadingPostFirstInterview,
    apiErrorPostFirstInterview,
    onSubmitFirstInterview
  } = useSubmitPostFirstInterview(selectedPatient);

  // Hook personalizado para actualizar la entrevista
  const { 
    successMessage: successMessageUpdateFirstInterview,
    errorMessage: errorMessageUpdateFirstInterview,
    isLoading: isLoadingUpdateFirstInterview,
    onSubmitUpdateFirstInterview
  } = useSubmitUpdateFirstInterview(patientInterview);

  // Hook personalizado para actualizar la entrevista de adultos
  const { 
    successMessage: successMessageUpdateFirstInterviewForAdults,
    errorMessage: errorMessageUpdateFirstInterviewForAdults,
    isLoading: isLoadingUpdateFirstInterviewForAdults,
    onSubmitUpdateFirstInterviewForAdults
  } = useSubmitUpdateFirstInterviewForAdults(patientInterview);

  // Hook personalizado para actualizar la sesión
  const { 
    successMessage: successMessageUpdateSession,
    errorMessage: errorMessageUpdateSession,
    isLoading: isLoadingUpdateSession,
    onSubmitUpdateSession
  } = useSubmitUpdateSession(editingSession);

  // Hook personalizado para finalizar tratamiento
  const {
    successMessage: successMessageDischarge,
    errorMessage: errorMessageDischarge,
    isLoading: isLoadingDischarge,
    onSubmitDischarge
  } = useSubmitDischarge(selectedPatient);

  // Hook personalizado para reactivar tratamiento
  const {
    reactivateTreatment,
    loading: loadingReactivate,
    errorMessage: errorMessageReactivateTreatment,
    successMessage: successMessageReactivateTreatment,
  } = useReactivateTreatment();

  const onReactivateTreatment = () => {
    reactivateTreatment(selectedPatient?.id);
  };

  // Seleccionar automáticamente un paciente (y ajustar filtro) si venimos desde Gestión de Pacientes
  useAutoSelectPatient({
    externalSelectedPatientId,
    filteredPatients,
    selectedPatient,
    setSelectedPatient,
    setStatusFilter,
    navigate,
    pathname: location.pathname
  });

  return (
    <>
      <Container>
        <Section
          Icon={FileText}
          title="Historias Clínicas"
          description="Consulta y registra la evolución clínica de cada paciente, abarcando entrevistas y sesiones terapéuticas."
        >
          <div className="clinical-history-layout">

            <PanelPatients 
              filteredPatients={filteredPatients} 
              statusFilter={statusFilter} 
              setStatusFilter={handleStatusFilterChange} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              loading={loadingGetsData} 
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
            />

            <div className="timeline-panel">
              <RightPanel
                loadingGetsData={loadingGetsData}
                selectedPatient={selectedPatient}
                loadingInterviewByPatientSelected={loadingInterviewByPatientSelected}
                errorInterviewByPatientSelected={errorInterviewByPatientSelected}
                onRetryInterview={refetchInterviewByPatientSelected}
                patientInterview={patientInterview}
                isReadOnly={isReadOnly}
                sessions={dataSessions.data}
                discharges={dataTreatmentClosure}
                onEditSession={(session) => handleEditSession(session, setEditingSession)}
                onViewInterview={() => openModal('viewInterviewModal')}
                onOpenPostFirstInterviewModal={(type) => {
                  handleInterviewTypeChange(type);
                  openModal('postFirstInterviewModal');
                }}
                onEditInterview={() => openModal('updateFirstInterviewModal')}
                onOpenDischarge={() => setTimeout(() => openModal('dischargeModal'), 0)}
                onReactivate={() => openModal('reactivateTreatmentModal')}
                selectedInterviewType={selectedInterviewType}
                onInterviewTypeChange={handleInterviewTypeChange}
              />
            </div>

          </div>
        </Section>
      </Container>

      <ModalPost
        id='postFirstInterviewModal'
        title="Registrar Primera Entrevista"
        formId='postFirstInterviewForm'
        loading={isLoadingPostFirstInterview}
      >
        {selectedInterviewType === 'adult' ? (
          <FormFirstInterviewAdult
            idModal='postFirstInterviewModal'
            formId='postFirstInterviewForm'
            onSubmit={onSubmitFirstInterview}
            loading={apiLoadingPostFirstInterview || isLoadingPostFirstInterview}
            error={errorMessage}
            errorMessage={errorMessage}
            successMessage={successMessage}
            initialValues={selectedPatient || {}}
          />
        ) : (
          <FormFirstInterview
            idModal='postFirstInterviewModal'
            formId='postFirstInterviewForm'
            onSubmit={onSubmitFirstInterview}
            loading={apiLoadingPostFirstInterview || isLoadingPostFirstInterview}
            error={errorMessage}
            errorMessage={errorMessage}
            successMessage={successMessage}
            initialValues={selectedPatient || {}}
          />
        )}
      </ModalPost>

      <ModalGet
        id='viewInterviewModal'
        title="Datos de la Primera Entrevista"
        className="viewInterviewModal"
      >
        {selectedInterviewType === 'adult' ? (
          <ViewInterviewForAdultsModal
            patient={selectedPatient}
            interview={patientInterview}
          />
        ) : (
          <ViewInterviewModal
            patient={selectedPatient}
            interview={patientInterview}
          />
        )}
      </ModalGet>

      <ModalUpdate
        id='updateFirstInterviewModal'
        title="Actualizar Primera Entrevista"
        formId='formUpdateFirstInterviewForm'
        loading={isLoadingUpdateFirstInterview}
        disabled={selectedPatient?.status === 'Inactivo'}
      >
        {selectedInterviewType === 'adult' ? (
          <FormFirstInterviewAdult
            idModal='updateFirstInterviewModal'
            formId='formUpdateFirstInterviewForm'
            onSubmit={onSubmitUpdateFirstInterviewForAdults}
            loading={isLoadingUpdateFirstInterviewForAdults}
            errorMessage={errorMessageUpdateFirstInterviewForAdults}
            successMessage={successMessageUpdateFirstInterviewForAdults}
            initialValues={mapInterviewToFormValues(patientInterview)}
            isUpdate={true}
          />
        ) : (
          <FormFirstInterview
            idModal='updateFirstInterviewModal'
            formId='formUpdateFirstInterviewForm'
            onSubmit={onSubmitUpdateFirstInterview}
            loading={isLoadingUpdateFirstInterview}
            errorMessage={errorMessageUpdateFirstInterview}
            successMessage={successMessageUpdateFirstInterview}
            initialValues={mapInterviewToFormValues(patientInterview)}
            isUpdate={true}
          />
        )}
      </ModalUpdate>

      <ModalUpdate
        id='updateSessionModal'
        title="Registrar observaciones clínicas"
        formId='formUpdateSessionForm'
        loading={isLoadingUpdateSession}
        disabled={selectedPatient?.status === 'Inactivo'}
      >
        {editingSession && (
          <FormSession
            key={editingSession.id}
            idModal='updateSessionModal'
            formId='formUpdateSessionForm'
            onSubmit={onSubmitUpdateSession}
            loading={isLoadingUpdateSession}
            errorMessage={errorMessageUpdateSession}
            successMessage={successMessageUpdateSession}
            initialValues={editingSession}
          />
        )}
      </ModalUpdate>

      <ModalPost
        id='dischargeModal'
        title="Finalizar tratamiento"
        formId='dischargeForm'
        loading={isLoadingDischarge}
      >
        <FormDischarge
          idModal='dischargeModal'
          formId='dischargeForm'
          onSubmit={onSubmitDischarge}
          loading={isLoadingDischarge}
          errorMessage={errorMessageDischarge}
          successMessage={successMessageDischarge}
          initialValues={{ date: new Date().toISOString() }}
        />
      </ModalPost>

      <ModalPost
        id='reactivateTreatmentModal'
        title="Reactivar tratamiento"
        formId='reactivateTreatmentForm'
        loading={loadingReactivate}
        buttonLabel="Reactivar tratamiento"
        buttonLabelLoading="Reactivando tratamiento..."
      >
        <FormReactivateTreatment
          idModal='reactivateTreatmentModal'
          formId='reactivateTreatmentForm'
          onSubmit={onReactivateTreatment}
          loading={loadingReactivate}
          errorMessage={errorMessageReactivateTreatment}
          successMessage={successMessageReactivateTreatment}
          initialValues={selectedPatient}
        />
      </ModalPost>
    </>
  );
};

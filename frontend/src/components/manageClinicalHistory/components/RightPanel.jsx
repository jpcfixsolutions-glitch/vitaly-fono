import React from 'react';
import { Loading } from '../..';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PatientTimeline } from './PatientTimeline.jsx';
import { SelectPatientPrompt, NoInterviewPrompt } from './index.js';

/**
 * Panel derecho de la historia clínica:
 * - Decide si muestra loader, mensaje de selección, mensaje de "sin entrevista"
 *   o el timeline completo del paciente.
 */
export const RightPanel = ({
  loadingGetsData,
  selectedPatient,
  loadingInterviewByPatientSelected,
  errorInterviewByPatientSelected,
  onRetryInterview,
  patientInterview,
  isReadOnly,
  sessions,
  discharges,
  onViewInterview,
  onEditInterview,
  onEditSession,
  onOpenPostFirstInterviewModal,
  onOpenDischarge,
  onReactivate,
  reactivateLoading,
  selectedInterviewType,
  onInterviewTypeChange,
}) => {
  // 1) Cargando datos base (pacientes, sesiones, entrevistas del usuario, cierres)
  if (loadingGetsData) {
    return <Loading className="table-container-loading" />;
  }

  // 2) Sin paciente seleccionado
  if (!selectedPatient) {
    return <SelectPatientPrompt />;
  }

  // 3) Cargando entrevista específica del paciente seleccionado
  if (loadingInterviewByPatientSelected) {
    return <Loading className="table-container-loading" />;
  }

  // 4) Una falla de carga no significa que la entrevista no exista.
  // Evita ofrecer un alta duplicada y conserva una acción de reintento.
  if (errorInterviewByPatientSelected) {
    return (
      <div className="timeline-prompt">
        <div className="timeline-prompt-content">
          <div className="timeline-prompt-icon interview">
            <AlertCircle />
          </div>
          <div>
            <h3>No se pudo cargar la primera entrevista</h3>
            <p>{errorInterviewByPatientSelected.message}</p>
          </div>
          <button type="button" className="btn btn-outline-primary" onClick={onRetryInterview}>
            <RefreshCw size={16} className="me-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // 5) Terminó de cargar la entrevista y realmente no existe
  if (!patientInterview) {
    return (
      <NoInterviewPrompt 
        onRegister={onOpenPostFirstInterviewModal}
        readOnly={isReadOnly}
        selectedType={selectedInterviewType}
        onTypeChange={onInterviewTypeChange}
      />
    );
  }

  // 6) Hay paciente y hay entrevista: mostrar timeline
  return (
    <PatientTimeline
      patient={selectedPatient}
      interview={patientInterview}
      sessions={sessions}
      discharges={discharges.data}
      onEditSession={onEditSession}
      onEditInterview={onEditInterview}
      onViewInterview={onViewInterview}
      onOpenDischarge={onOpenDischarge}
      onReactivate={onReactivate}
      reactivateLoading={reactivateLoading}
      readOnly={isReadOnly}
    />
  );
};


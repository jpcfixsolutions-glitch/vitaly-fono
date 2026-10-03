import React from 'react';
import { EditSessionModal } from './EditSessionModal';
import { DischargeModal } from './DischargeModal';
import { InitialInterviewModal } from './InitialInterviewModal';

export const ClinicalHistoryModalsContainer = ({
  // Estados de Sesión
  editingSession,
  sessionText,
  setSessionText,
  saveSessionEdit,
  sessionSaving,
  sessionSaveSuccess,
  sessionSaveError,
  // Estados de Finalización
  selectedPatient,
  handlePatientDischarge,
  dischargeLoading,
  dischargeError,
  dischargeSuccess,
  // Estados de Entrevista
  interviewModalMode,
  patientInterview,
  handleCloseInterview,
  handleSaveInterview,
  submittingInterview,
  interviewSuccess,
  interviewSuccessMessage,
  interviewError,
  interviewErrorMessage
}) => {
  return (
    <>
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          sessionText={sessionText}
          setSessionText={setSessionText}
          onSave={saveSessionEdit}
          loading={sessionSaving}
          success={sessionSaveSuccess}
          error={sessionSaveError}
        />
      )}

      {selectedPatient && (
        <DischargeModal
          onSave={handlePatientDischarge}
          loading={dischargeLoading}
          error={dischargeError}
          errorMessage={dischargeError?.message || 'No se pudo registrar la finalización.'}
          success={dischargeSuccess}
          successMessage={dischargeSuccess ? 'Finalización registrada correctamente.' : ''}
        />
      )}

      {selectedPatient && (
        <InitialInterviewModal
          mode={interviewModalMode}
          patient={selectedPatient}
          interview={patientInterview}
          onClose={handleCloseInterview}
          onSave={handleSaveInterview}
          submitting={submittingInterview}
          success={interviewSuccess}
          successMessage={interviewSuccessMessage}
          error={interviewError}
          errorMessage={interviewErrorMessage}
        />
      )}
    </>
  );
};
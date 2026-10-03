import React from 'react';
import { Loading } from '../../loading';
import { PatientTimeline } from './PatientTimeline';
import { SelectPatientPrompt } from './SelectPatientPrompt';
import { NoInterviewPrompt } from './NoInterviewPrompt';

export const ClinicalHistoryContent = ({
  loading,
  loadingInterview,
  selectedPatient,
  patientInterview,
  patientSessions,
  patientDischarge,
  isReadOnly,
  onOpenInterview,
  onEditSession,
  onOpenDischarge,
  onReactivate,
  dischargeLoading
}) => {
  if (loading || loadingInterview) {
    return <Loading className="table-container-loading" />;
  }

  if (!selectedPatient) {
    return <SelectPatientPrompt />;
  }

  if (!patientInterview) {
    return (
      <NoInterviewPrompt 
        onRegister={() => onOpenInterview('create')} 
        readOnly={isReadOnly} 
      />
    );
  }

  return (
    <PatientTimeline
      patient={selectedPatient}
      interview={patientInterview}
      sessions={patientSessions}
      discharges={patientDischarge}
      onEditSession={onEditSession}
      onEditInterview={() => onOpenInterview('update')}
      onViewInterview={() => onOpenInterview('view')}
      onOpenDischarge={onOpenDischarge}
      onReactivate={onReactivate}
      reactivateLoading={dischargeLoading}
      readOnly={isReadOnly}
    />
  );
};
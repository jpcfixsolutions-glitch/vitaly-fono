import React from 'react';
import { Button, Loading } from '../..';
import { TimelineItem } from './TimelineItem.jsx';
import { calculateAge } from '../../../utils/age.js';
import { processTimelineItems } from '../utils/processTimelineItems';

export const PatientTimeline = ({ 
  patient, 
  interview, 
  sessions, 
  discharges = [], 
  onEditSession, 
  onEditInterview, 
  readOnly = false, 
  onViewInterview, 
  onOpenDischarge, 
  onReactivate, 
  reactivateLoading = false,
}) => {
  // Filtrar sesiones que correspondan al paciente actual para evitar mezclar historias clínicas
  const patientSessions = sessions?.filter(session => session.id_patient === patient?.id) || [];
  const patientDischarges = discharges?.filter(discharge => discharge.id_patient === patient?.id) || [];

  const timelineItems = processTimelineItems(interview, patientSessions, patientDischarges);

  return (
    <>
      {interview ? (
        <>
          <div className="timeline-header">
            <div className="timeline-header-content">
              <div>
                <h2>Historia Clínica de</h2>
                <p>
                  {patient.name} {patient.last_name} • {calculateAge(patient.birth_date) || 'Sin datos'} • {patientSessions.length || 0} sesiones
                </p>
              </div>
              <div className="timeline-header-actions">
                {interview && (
                  <Button
                    label="Ver Entrevista Inicial"
                    parentMethod={onViewInterview}
                    className="btn-interview"
                  />
                )}
                {(!readOnly && (patient.status === 'Activo' || patient.status === true)) && (
                  <button
                    type="button"
                    className="btn btn-discharge timeline-action-btn"
                    onClick={onOpenDischarge}
                  >
                    Finalizar tratamiento
                  </button>
                )}
                {(readOnly && (patient.status === 'Inactivo' || patient.status === false)) && (
                  <button
                    type="button"
                    className="btn btn-reactivate-clinical timeline-action-btn"
                    onClick={onReactivate}
                    disabled={reactivateLoading}
                  >
                    Reactivar tratamiento
                    {reactivateLoading && <Loading className="mini-loading" />}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="timeline-content">
            <div className="timeline-items-wrapper">
              {interview && timelineItems.length > 0 ? (
                timelineItems.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isLast={index === timelineItems.length - 1}
                    onEditSession={onEditSession}
                    onEditInterview={onEditInterview}
                    readOnly={readOnly}
                  />
                ))
              ) : (
                <Loading className="table-container-loading" />
              )}
            </div>
          </div>
        </>
      ) : (
        <Loading className="table-container-loading" />
      )}
    </>
  );
};

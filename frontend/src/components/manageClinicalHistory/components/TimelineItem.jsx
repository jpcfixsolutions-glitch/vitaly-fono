import React, { useState, useMemo } from 'react';
import { ButtonIcon } from '../..';
import { Calendar, Clock, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseToDate, extractTimeString, extractDate, extractTime } from '../../../utils';
import { isSessionActive as checkSessionActive } from '../utils/sessionUtils';

// --- NUEVOS IMPORTS ---
import SessionFiles from './SessionFiles';
import FilePreviewModal from './FilePreviewModal';

export const TimelineItem = ({ 
  item, 
  isLast, 
  onEditSession, 
  onEditInterview, 
  readOnly = false 
}) => {
  const isInterview = item.tipo === 'entrevista';
  const isDischarge = item.tipo === 'cierre';
  const isReactivation = item.tipo === 'reactivacion';

  const data = item.data;

  // Estado para manejar qué archivo se está previsualizando
  const [previewFile, setPreviewFile] = useState(null);

  const sessionDateRaw = item?.date || data?.session_date;
  const isSessionActive = checkSessionActive({ 
    isInterview, 
    sessionDate: sessionDateRaw 
  });

  const canEdit = !readOnly && (isInterview || (!isDischarge && !isReactivation && isSessionActive));

  return (
    <div className="timeline-item">
      {!isLast && <div className="timeline-item-line"></div>}

      <div className="timeline-item-container">
        <div className={`timeline-item-indicator ${isInterview ? 'interview' : isDischarge ? 'discharge' : isReactivation ? 'reactivation' : 'session'}`}>
          <div className="timeline-item-indicator-dot"></div>
        </div>

        <div className="timeline-item-body">
          <div className="timeline-item-header">
            <div className="timeline-item-header-content">
              <div className="timeline-item-meta-stack">
                <div className="timeline-item-meta-item date">
                  <Calendar />
                  <span>
                    {item?.date_parsed}
                  </span>
                </div>
                <div className="timeline-item-meta-item time">
                  <Clock />
                  <span>
                    {item?.time_parsed}
                  </span>
                </div>
                <span className={
                  `timeline-item-tag ${isInterview 
                  ? 'interview' : isDischarge 
                  ? 'discharge' : isReactivation 
                  ? 'reactivation' : 'session'}`
                }>
                  {isInterview 
                    ? 'Primera Entrevista' : isDischarge 
                    ? (String(data?.type || '').includes('Interrupción') 
                    ? 'Interrupción del tratamiento' : 'Finalización del tratamiento') : isReactivation 
                    // ? 'Reactivación del tratamiento' : `Sesión ${item.sessionNumber || data?.sessionNumber || (typeof data?.session_index === 'number' ? data.session_index + 1 : data?.status)}`
                    ? 'Reactivación del tratamiento' : 'Sesión'
                    }
                </span>
                {canEdit && (
                  <ButtonIcon
                    parentMethod={() => (isInterview ? onEditInterview?.(data) : onEditSession?.(data))}
                    className="timeline-item-edit-btn"
                    icon="fa-pen-to-square"
                  />
                )}
              </div>

              <div className="timeline-item-header-content-updated">
                <span 
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    opacity: 0.7,
                    marginTop: '4px',
                    display: 'block'
                  }}
                >
                  {isInterview ? (
                    <span>
                      Última modificación el {extractDate(data?.interview?.updated_at) + ' a las ' + extractTime(data?.interview?.updated_at)} hs.
                    </span>
                  ) : isDischarge || isReactivation ? (
                    <span>
                      Última modificación el {extractDate(item?.created_at) + ' a las ' + extractTime(item?.created_at)} hs.
                    </span>
                  ) : (
                    <span>
                      Última modificación el {extractDate(item?.updated_at) + ' a las ' + extractTime(item?.updated_at)} hs.
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ToDo: todavia queda chequear bien esto */}
          <div className="timeline-item-content">
            {isInterview ? (
              <div className="timeline-item-content-interview">
                <div>
                  <strong>Motivo de consulta: </strong> 
                  {data.interview.reason_for_consultation || 'Sin motivo especificado'}
                </div>
              </div>
            ) : isDischarge || isReactivation ? (
              <div className="timeline-item-content-interview">
                <div>
                  <strong>Motivo: </strong> 
                  {data?.reason || data?.closing_reason || 'Sin motivo especificado'}
                </div>
              </div>
            ) : (
              <>
                {(item?.clinical_notes && String(item?.clinical_notes).trim() !== '')
                  ? <div className="timeline-session-observation"><strong>Observaciones clínicas: </strong> {item?.clinical_notes}</div>
                  : <div className="timeline-item-empty-note"><strong>Sin observaciones clínicas.</strong></div>
                }

                {/* --- SECCIÓN DE ARCHIVOS (NUEVO) --- */}
                <div style={{ marginTop: '10px' }}>
                  <SessionFiles
                    sessionId={data?.id}
                    readOnly={true}
                    onPreview={setPreviewFile}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DE PREVISUALIZACIÓN (NUEVO) --- */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};
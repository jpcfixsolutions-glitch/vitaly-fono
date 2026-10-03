import React from 'react';
import { Button } from '../..';
import { FileText } from 'lucide-react';

export const NoInterviewPrompt = ({
  onRegister,
  readOnly = false,
  selectedType = 'child',
  onTypeChange,
}) => {
  return (
    <div className="timeline-prompt">
      <div className="timeline-prompt-content">
        <div className="timeline-prompt-icon interview">
          <FileText />
        </div>
        <div>
          <h3>Primera Entrevista Requerida</h3>
          <p>Antes de visualizar el seguimiento, es necesario completar la primera entrevista del paciente.</p>
        </div>

        {!readOnly && (
          <div className="d-flex flex-column gap-2" style={{ minWidth: '260px' }}>
            <label htmlFor="first-interview-type-select" className="form-label mb-0">
              Selecciona la primera entrevista para
            </label>
            <select
              id="first-interview-type-select"
              className="form-select"
              value={selectedType}
              onChange={(event) => onTypeChange?.(event.target.value)}
            >
              <option value="child">Niño</option>
              <option value="adult">Adulto</option>
            </select>

            <Button
              label="Registrar Primera Entrevista"
              parentMethod={() => onRegister?.(selectedType)}
              className="btn-interview"
            >
              <FileText size={16} style={{ marginRight: '8px' }} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
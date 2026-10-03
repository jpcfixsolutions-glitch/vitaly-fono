import React from 'react';
import { User } from 'lucide-react';

export const SelectPatientPrompt = () => {
  return (
    <div className="timeline-prompt">
      <div className="timeline-prompt-content">
        <div className="timeline-prompt-icon user">
          <User />
        </div>
        <div>
          <h3>Seleccione un Paciente</h3>
          <p>Elija un paciente de la lista para ver su historia clínica.</p>
        </div>
      </div>
    </div>
  );
};
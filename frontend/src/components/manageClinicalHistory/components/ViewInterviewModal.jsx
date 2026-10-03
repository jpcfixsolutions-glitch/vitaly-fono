import React from 'react';
import { SectionViewPersonalData } from './SectionViewPersonalData';
import { SectionViewFamilyData } from './SectionViewFamilyData';
import { SectionViewAntecedentData } from './SectionViewAntecedentData';
import { SectionViewSchoolingData } from './SectionViewSchoolingData';
import { SectionViewPsychologicalAspects } from './SectionViewPsychologicalAspects';
import { mapInterviewToViewData } from '../utils/mapInterviewToViewData';

/**
 * Componente modal para visualizar los detalles de la primera entrevista
 * Muestra la misma estructura que el formulario pero en modo solo lectura
 */
export const ViewInterviewModal = ({ patient, interview }) => {
  // Mapear los datos de la entrevista a un formato que coincida con los campos del formulario
  const viewData = mapInterviewToViewData(interview, patient);

  if (!interview) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">No hay datos de entrevista disponibles.</p>
      </div>
    );
  }

  return (
    <div className="first-interview-form">
      <SectionViewPersonalData data={viewData} />
      <SectionViewFamilyData data={viewData} />
      <SectionViewAntecedentData data={viewData} />
      <SectionViewSchoolingData data={viewData} />
      <SectionViewPsychologicalAspects data={viewData} />
    </div>
  );
};

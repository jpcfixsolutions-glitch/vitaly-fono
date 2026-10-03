import { Brain } from 'lucide-react';
import { ViewField } from './ViewField';

/**
 * Sección de Aspectos psicológicos generales en modo solo lectura
 */
export const SectionViewPsychologicalAspects = ({ data }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <Brain size={18} />
        </div>
        <h3>Aspectos psicológicos generales</h3>
      </div>
      <div className="mb-3">
        <ViewField 
          label="Personalidad (descripción general)" 
          value={data?.personality_description} 
          type="textarea"
        />
      </div>
      <div className="mb-3">
        <ViewField 
          label="Motivo de consulta" 
          value={data?.reason_for_consultation} 
          type="textarea"
        />
      </div>
    </section>
  );
};

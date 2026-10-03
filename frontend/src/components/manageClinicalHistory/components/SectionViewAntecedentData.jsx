import { Activity } from 'lucide-react';
import { ViewField } from './ViewField';

/**
 * Sección de Antecedentes patológicos y del desarrollo en modo solo lectura
 */
export const SectionViewAntecedentData = ({ data }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <Activity size={18} />
        </div>
        <h3>Antecedentes patológicos y del desarrollo</h3>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <ViewField label="Perinatal" value={data?.perinatal_history} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField 
            label="Generales (Marcha, Lenguaje, Control de esfínteres, Socialización)" 
            value={data?.general_development} 
            type="textarea"
          />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField 
            label="Enfermedades / Alergias (Medicamentos, suplementos)" 
            value={data?.diseases_allergies} 
            type="textarea"
          />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField 
            label="Historia familiar (Patologías / enfermedades mentales y físicas)" 
            value={data?.family_pathology_history} 
            type="textarea"
          />
        </div>
      </div>
    </section>
  );
};

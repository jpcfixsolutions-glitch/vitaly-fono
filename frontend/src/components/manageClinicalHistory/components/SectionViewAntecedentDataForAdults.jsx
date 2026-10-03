import { Activity } from 'lucide-react';
import { ViewField } from './ViewField';

/**
 * Sección de antecedentes de adultos en modo solo lectura
 */
export const SectionViewAntecedentDataForAdults = ({ data }) => {
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
          <ViewField label="Patologías / Enfermedades actuales o anteriores" value={data?.pathologies_diseases} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="Medicación (qué / cuánto / por qué)" value={data?.medication} type="textarea" />
        </div>

        <div className="col-md-6 mb-3">
          <ViewField label="Consumo de sustancias / alcohol" value={data?.substance_alcohol_consumption} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="Pasatiempos / Deportes" value={data?.hobbies_sports} type="textarea" />
        </div>

        <div className="col-md-6 mb-3">
          <ViewField label="Familia (genograma)" value={data?.genogram || data?.family_genogram} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="Historia familiar (patologías / enfermedades mentales y físicas)" value={data?.family_pathology_history} type="textarea" />
        </div>

        <div className="col-md-12 mb-3">
          <ViewField label="Pensamientos negativos / intentos de suicidio / autolesiones" value={data?.negative_thoughts} type="textarea" />
        </div>

        <div className="col-md-12 mb-3">
          <ViewField label="Abuso / maltrato físico o psicológico" value={data?.abuse_mistreatment} type="textarea" />
        </div>

        <div className="col-md-12 mb-3">
          <ViewField label="Motivo de consulta" value={data?.reason_for_consultation} type="textarea" />
        </div>
      </div>
    </section>
  );
};

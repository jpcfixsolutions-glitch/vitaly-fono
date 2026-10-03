import { ViewField } from './ViewField';

/**
 * Sección de información extra de datos familiares en modo solo lectura
 */
export const SectionViewFamilyExtraData = ({ data }) => {
  return (
    <section className="fi-section">
      <div className="fi-card">
        <h4>Información extra</h4>
        <div className="mt-3 mb-3">
          <ViewField 
            label="Otras personas convivientes (convivencia no doméstica)" 
            value={data?.non_domestic_cohabitation} 
            type="textarea"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <ViewField label="Genograma" value={data?.genogram} type="textarea" />
          </div>
          <div className="col-md-6">
            <ViewField label="Dinámicas familiares" value={data?.family_dynamics} type="textarea" />
          </div>
        </div>
      </div>
    </section>
  );
};

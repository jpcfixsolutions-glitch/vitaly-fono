import { User } from 'lucide-react';
import { ViewField } from './ViewField';

/**
 * Sección de datos personales en modo solo lectura
 */
export const SectionViewPersonalData = ({ data }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <User size={18} />
        </div>
        <h3>Datos personales</h3>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <ViewField label="Nombre completo" value={data?.complete_name} />
        </div>
        <div className="col-md-4 mb-3">
          <ViewField label="Fecha de nacimiento" value={data?.birth_date === "undefined/undefined/" ? "-" : data?.birth_date} />
        </div>
        <div className="col-md-4 mb-3">
          <div className="form-group">
            <label className="form-label">Edad</label>
            <span className="age-data-patient">{data?.age || '-'}</span>
          </div>
        </div>
        <div className="col-12 mb-3">
          <ViewField label="Dirección" value={data?.address} />
        </div>
        <div className="col-md-4 mb-3">
          <ViewField label="Teléfono de contacto" value={data?.phone} />
        </div>
        <div className="col-md-8 mb-3">
          <ViewField label="Con quién vive (convivencia doméstica)" value={data?.domestic_cohabitation} />
        </div>
      </div>
    </section>
  );
};

import { User } from 'lucide-react';
import { ViewField } from './ViewField';

const formatTherapyBoolean = (value) => {
  if (value === true || value === 1 || value === '1' || value === 'true') return 'Sí';
  if (value === false || value === 0 || value === '0' || value === 'false') return 'No';
  return value || '-';
};

/**
 * Sección de datos personales en modo solo lectura
 */
export const SectionViewPersonalDataForAdults = ({ data }) => {
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
          <ViewField label="Estado civil" value={data?.civil_status} />
        </div>
        <div className="col-md-4 mb-3">
          <ViewField label="Teléfono de contacto" value={data?.phone} />
        </div>
        <div className="col-md-4 mb-3">
          <ViewField label="Segundo teléfono de contacto" value={data?.second_phone} />
        </div>

        <div className="col-md-6 mb-3">
          <ViewField label="Con quién vive" value={data?.living_with || data?.domestic_cohabitation} />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="A qué se dedica" value={data?.profession} />
        </div>

        <div className="col-12 mb-3">
          <ViewField label="Derivación / Cómo llegó acá" value={data?.derivation} />
        </div>

        <div className="col-md-2 mb-3">
          <ViewField label="¿Fue a terapia?" value={formatTherapyBoolean(data?.has_had_therapy)} />
        </div>
        <div className="col-md-2 mb-3">
          <ViewField label="Cuánto tiempo" value={data?.therapy_duration} />
        </div>
        <div className="col-md-8 mb-3">
          <ViewField label="Motivo de salida de la terapia" value={data?.reason_for_leaving_therapy} />
        </div>
        <div className="col-md-12 mb-3">
          <ViewField label="Corriente" value={data?.current_therapy_type} />
        </div>
      </div>
    </section>
  );
};

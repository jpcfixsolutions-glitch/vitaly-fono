import { ViewField } from './ViewField';

/**
 * Sección de datos del padre en modo solo lectura
 */
export const SectionViewFatherData = ({ data }) => {
  return (
    <div className="col-md-6 mb-3">
      <div className="fi-card">
        <h4>Padre</h4>
        <div className="row">
          <div className="col-12 mb-3">
            <ViewField label="Nombre/s y apellido/s" value={data?.father_name} />
          </div>
          <div className="col-md-6 mb-3">
            <ViewField label="Vive" value={data?.father_lives} />
          </div>
          <div className="col-md-6 mb-3">
            <ViewField label="Edad" value={data?.father_age} />
          </div>
          <div className="col-12 mb-3">
            <ViewField label="Profesión / Estudios" value={data?.father_profession} type="textarea" />
          </div>
          <div className="col-12 mb-0">
            <ViewField label="Horarios laborales" value={data?.father_work_hours} />
          </div>
        </div>
      </div>
    </div>
  );
};

import { ViewField } from './ViewField';

/**
 * Sección de datos de la madre en modo solo lectura
 */
export const SectionViewMotherData = ({ data }) => {
  return (
    <div className="col-md-6 mb-3">
      <div className="fi-card">
        <h4>Madre</h4>
        <div className="row">
          <div className="col-12 mb-3">
            <ViewField label="Nombre/s y apellido/s" value={data?.mother_name} />
          </div>
          <div className="col-md-6 mb-3">
            <ViewField label="Vive" value={data?.mother_lives} />
          </div>
          <div className="col-md-6 mb-3">
            <ViewField label="Edad" value={data?.mother_age} />
          </div>
          <div className="col-12 mb-3">
            <ViewField label="Profesión / Estudios" value={data?.mother_profession} type="textarea" />
          </div>
          <div className="col-12 mb-0">
            <ViewField label="Horarios laborales" value={data?.mother_work_hours} />
          </div>
        </div>
      </div>
    </div>
  );
};

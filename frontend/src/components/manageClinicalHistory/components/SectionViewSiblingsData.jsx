import { ViewField } from './ViewField';

/**
 * Sección de datos de hermanos en modo solo lectura
 */
export const SectionViewSiblingsData = ({ data }) => {
  const siblings = data?.siblings || [];

  return (
    <div className="fi-card mb-4">
      <h4 className="mb-3">Hermanos</h4>
      <div className="row">
        {siblings.length > 0 ? (
          siblings.map((sibling, index) => (
            <div key={index} className="col-12 mb-3">
              <div className="row align-items-end g-2">
                <div className="col-md-5">
                  <ViewField label="Nombre/s y apellido/s" value={sibling?.name} />
                </div>
                <div className="col-md-1">
                  <ViewField label="Edad" value={sibling?.age} />
                </div>
                <div className="col-md-6">
                  <ViewField label="Estudios" value={sibling?.studies} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted mb-0">No hay hermanos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { Button } from "../../ui/button";

/**
 * ViewDataHeaderSection
 *
 * Este componente sirve como cabecera para tablas de datos, permitiendo mostrar
 * un título opcional y un botón de acción (Ej: "Nuevo registro").
 *
 * Además, si está activada la opción `subSection`, se renderiza un filtro de selección
 * de estado (activo/inactivo) junto con el botón, principalmente usado en vistas que requieren filtrar registros por estado.
 *
 * Props:
 * @param {Object} props
 * @param {string} props.title - Título de la cabecera mostrado en la tabla (solo si subSection es false).
 * @param {string} props.buttonLabel - Etiqueta del botón de acción principal.
 * @param {string} props.buttonDataBsTarget - Valor para el atributo `data-bs-target` del botón (para modales).
 * @param {string} props.buttonClassName - Clases CSS adicionales para el botón.
 * @param {string} props.className - Clases CSS adicionales para la sección de cabecera, usadas para controlar el diseño (por ej. 'header-for-error').
 * @param {boolean} [props.subSection=false] - Bandera para indicar si se debe mostrar la variante con filtro de estado.
 * @param {Object} [props.subSectionHandler] - Objeto que maneja el control del filtro de estado (solo relevante si subSection es true).
 *   @param {function} props.subSectionHandler.setShowInactive - Función para actualizar si se muestran elementos inactivos.
 *   @param {boolean} props.subSectionHandler.showInactive - Valor que indica si el filtro está en "Inactivo".
 *
 * Uso principal en secciones que requieren cabeceras consistentes, con opción
 * de filtrar por estado y lanzar acciones principales (crear/modificar entidad).
 */
export const ViewDataHeaderSection = ({
  title, 
  buttonLabel,
  buttonDataBsTarget, 
  buttonClassName, 
  className, 
  subSection = false, 
  subSectionHandler = {
    setShowInactive: undefined,
    showInactive: false
  }
}) => {
  return (
    <>
      {/* Variante para subsección (tabla con filtro estado activo/inactivo) */}
      {subSection && (
        <div className="table-header-section header-for-error">
          <div className="table-header">
            {/* Select para filtrar por estado: activo/inactivo */}
            <select
              className="form-select status-filter-select"
              aria-label="Filtrar por estado"
              value={subSectionHandler.showInactive ? "Inactivo" : "Activo"}
              onChange={(e) => subSectionHandler.setShowInactive(e.target.value === "Inactivo")}
            >
              <option value="Activo">Registros activos</option>
              <option value="Inactivo">Registros inactivos</option>
            </select>
            {/* Botón principal que generalmente abre un modal */}
            <Button
              label={buttonLabel}
              parentMethod={() => { }}
              dataBsToggle="modal"
              dataBsTarget={buttonDataBsTarget}
              className={buttonClassName}
            />
          </div>
        </div>
      )}

      {/* Variante para sección principal (sin filtro por estado) */}
      {!subSection && (
        <>
          {/* Cuando className es "header-for-error", renderiza header con ese estilo */}
          {className === "header-for-error" && (
            <div className="table-header-section header-for-error">
              <div className="table-header">
                {/* Título de la tabla */}
                <h3 className="table-title">{title}</h3>
                {/* Botón principal */}
                <Button
                  label={buttonLabel}
                  parentMethod={() => { }}
                  dataBsToggle="modal"
                  dataBsTarget={buttonDataBsTarget}
                  className={buttonClassName}
                />
              </div>
            </div>
          )}
          {/* Cuando className es vacío, renderiza header estándar */}
          {className === "" && (
            <div className="table-header-section">
              <div className="table-header">
                {/* Título de la tabla */}
                <h3 className="table-title">{title}</h3>
                {/* Botón principal */}
                <Button
                  label={buttonLabel}
                  parentMethod={() => { }}
                  dataBsToggle="modal"
                  dataBsTarget={buttonDataBsTarget}
                  className={buttonClassName}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
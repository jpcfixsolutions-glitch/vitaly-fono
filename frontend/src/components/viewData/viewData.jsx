import { Button } from "../ui/button";
import { processData } from "../processData";
import { Table } from "../table";
import { ViewDataHeaderSection } from "./components/ViewDataHeaderSection";

/**
 * Renderiza una tabla genérica de datos con encabezado, manejo de estados (cargando, error, vacío)
 * y botón de acción. Permite personalizaciones para modales y acciones por fila.
 *
 * @component
 * @param {Object} props
 * @param {{data: Array}} props.data - Objeto con la propiedad `data` que es un array de registros a mostrar en la tabla.
 * @param {boolean} props.apiLoading - Indica si los datos están siendo cargados desde la API.
 * @param {Error|string|boolean} props.apiError - Error devuelto por la API, si existe.
 * @param {string} props.message - Mensaje personalizado que se muestra en caso de error o sin datos.
 * @param {Array} props.columns - Configuración de columnas para la tabla, compatible con el componente Table.
 * @param {string} props.title - Título que se muestra en el encabezado de la tabla.
 * @param {string} [props.buttonLabel] - Texto del botón de acción que se muestra junto al título.
 * @param {string} [props.buttonDataBsTarget] - Valor del atributo `data-bs-target` para el botón de acción (por ejemplo, el id del modal a abrir).
 * @param {string} [props.buttonClassName] - Clases CSS adicionales para el botón de acción.
 * @param {string} [props.classNameEspecificTable] - Clases CSS adicionales para la tabla.
 * @param {function} [props.stateRenderer] - Función para renderizar un estado personalizado (por ejemplo, error o vacío específico) que recibe { apiLoading, apiError, data }; si retorna algo, se renderiza ese contenido en lugar de la tabla.
 * @param {string} [props.dataBsTargetUpdate] - Prop especial para pasar el id del modal de actualización a la tabla.
 * @param {string} [props.dataBsTargetDelete] - Prop especial para pasar el id del modal de borrado a la tabla.
 * @param {string} [props.dataBsTargetView] - Prop especial para pasar el id del modal de vista detallada a la tabla.
 * @param {function} [props.renderRowActions] - Render prop para mostrar acciones personalizadas por fila. Recibe el `row` como parámetro.
 * @param {boolean} [props.hideActions=false] - Si es `true`, oculta la columna de acciones (legacy, pendiente refactorización).
 * @param {boolean} [props.deleteButton=false] - Si es `true`, muestra el botón de borrado en las acciones de fila (legacy, pendiente refactorización).
 * @returns {JSX.Element}
 */
export const ViewData = ({
  data,
  apiLoading,
  apiError,
  message,
  columns,
  title,
  buttonLabel,
  buttonDataBsTarget,
  buttonClassName,
  classNameEspecificTable,
  stateRenderer, // Es un estado de error particular del componente que importa viewData.
  dataBsTargetUpdate = undefined,
  dataBsTargetDelete = undefined,
  dataBsTargetView = undefined,
  renderRowActions = undefined,
  hideActions = false,
  hideHeader = false,
  deleteButton = false, // ToDo: sacar esto cuando se modifique la tabla.
  subSection = false, // Si es true, es porque estamos en una subsección y no queremos el header completo con el title, sino mas bien un select para filtrar por activos o inactivos.
  subSectionHandler = undefined, // Función para manejar el estado de la subsección, es decir, para el select de activos o inactivos.
}) => {

  // Verifica si hay datos en el array data.data para controlar el estilo del loading.
  const hasData = Array.isArray(data?.data) && data.data.length > 0;
  const containerClass = apiLoading ? "table-container-not-data" : (hasData ? "table-container" : "table-container-not-data");

  return (
    <div className={`table-main-container ${containerClass} ${subSection ? "table-main-container-sub-section" : ""}`}>
      {(() => {
        // Renderiza el estado personalizado si existe.
        const customState = stateRenderer?.({ apiLoading, apiError, data });
        if (customState !== undefined && customState !== null) return customState;

        const processedData = processData(data, apiLoading, apiError, message);

        // Si processData retorna un componente (loading, error, vacío), lo mostramos y no se muestra la tabla.
        if (processedData) return (
          <>
            {!hideHeader && (
              <ViewDataHeaderSection
                title={title}
                buttonLabel={buttonLabel}
                buttonDataBsTarget={buttonDataBsTarget}
                buttonClassName={buttonClassName}
                className="header-for-error"
                subSection={subSection}
                subSectionHandler={subSectionHandler}
              />
            )}
            {processedData}
          </>
        );

        return (
          <>
            {!hideHeader && (
              <ViewDataHeaderSection
                title={title}
                buttonLabel={buttonLabel}
                buttonDataBsTarget={buttonDataBsTarget}
                buttonClassName={buttonClassName}
                className=""
                subSection={subSection}
                subSectionHandler={subSectionHandler}
              />
            )}
            <div className="table-content">
              <Table
                data={data.data}
                columns={columns}
                classNameEspecificTable={classNameEspecificTable || ""}
                dataBsToggle="modal" // ToDo: sacar esto cuando se modifique la tabla.
                dataBsTargetUpdate={dataBsTargetUpdate}
                dataBsTargetDelete={dataBsTargetDelete}
                dataBsTargetView={dataBsTargetView}
                renderRowActions={renderRowActions}
                hideActions={hideActions} // ToDo: sacar esto cuando se modifique la tabla. o quizás no.
                deleteButton={deleteButton} // ToDo: sacar esto cuando se modifique la tabla.
              />
            </div>
          </>
        )
      })()}
    </div>
  )
}
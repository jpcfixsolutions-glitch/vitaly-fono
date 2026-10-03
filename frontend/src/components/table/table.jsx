import "./table.css";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";

/**
 * Componente Table que renderiza una tabla dinámica con encabezados y cuerpo.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.columns - Definición de columnas de la tabla.
 * @param {Array} props.data - Datos a renderizar en la tabla.
 * @param {string} [props.classNameEspecificTable] - Clases CSS adicionales para la tabla.
 * @param {string} [props.dataBsToggle] - Atributo data-bs-toggle para integración con modales Bootstrap.
 * @param {string} [props.dataBsTargetUpdate] - Selector del modal de actualización.
 * @param {string} [props.dataBsTargetDelete] - Selector del modal de eliminación.
 * @param {Function} [props.handleUpdate] - Función callback para la acción de update.
 * @param {Function} [props.handleDelete] - Función callback para la acción de delete.
 * @param {Function} [props.renderRowActions] - Función render-prop para renderizar las acciones por fila.
 * @param {Function} [props.handleView] - Función callback para la acción de vista.
 * @param {string} [props.dataBsTargetView] - Selector del modal de vista.
 * @param {boolean} [props.hideActions=false] - Oculta la columna de acciones si es true.
 * @param {boolean} [props.deleteButton=false] - Muestra el botón de eliminar si es true.
 * @returns {JSX.Element}
 */
export function Table({
  columns,
  data,
  classNameEspecificTable,
  dataBsToggle, // ToDo: sacar esto cuando se modifique la tabla. reemplazar donde diga databstoggle por "modal".
  dataBsTargetUpdate = undefined,
  dataBsTargetDelete = undefined,
  dataBsTargetView = undefined,
  handleUpdate = undefined, // ToDo: sacar esto cuando se modifique la tabla. todo esto es porque la idea es renderizarlos por renderRowActions.
  handleDelete = undefined, // ToDo: sacar esto cuando se modifique la tabla. todo esto es porque la idea es renderizarlos por renderRowActions.
  handleView = undefined, // ToDo: sacar esto cuando se modifique la tabla. todo esto es porque la idea es renderizarlos por renderRowActions.
  renderRowActions = undefined,
  hideActions = false, // ToDo: sacar esto cuando se modifique la tabla.
  deleteButton = false // ToDo: sacar esto cuando se modifique la tabla.
}) {
  return (
    <table className={`table table-hover table-payments ${classNameEspecificTable}`}>
      <TableHeader columns={columns} hideActions={hideActions} />
      <TableBody
        data={data}
        columns={columns}
        hideActions={hideActions}
        renderRowActions={renderRowActions}
        handleView={handleView}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        dataBsToggle={dataBsToggle}
        dataBsTargetView={dataBsTargetView}
        dataBsTargetUpdate={dataBsTargetUpdate}
        dataBsTargetDelete={dataBsTargetDelete}
        deleteButton={deleteButton}
      />
    </table>
  );
}

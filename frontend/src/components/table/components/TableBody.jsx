import React from 'react';
import { TableRow } from './TableRow';

/**
 * TableBody
 * Componente encargado de renderizar el cuerpo de una tabla, iterando sobre los datos y renderizando una fila por cada elemento.
 * Utiliza el componente TableRow para renderizar cada fila, pasando los datos, índice, columnas, y las funciones de acción si se requieren.
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.data - Datos a renderizar en la tabla.
 * @param {Array} props.columns - Definición de columnas de la tabla.
 * @param {boolean} [props.hideActions=false] - Oculta la columna de acciones si es true.
 * @param {Function} [props.renderRowActions] - Función render-prop para renderizar las acciones por fila.
 * @param {Function} [props.handleView] - Función callback para la acción de vista.
 * @param {Function} [props.handleUpdate] - Función callback para la acción de update.
 * @param {Function} [props.handleDelete] - Función callback para la acción de delete.
 * @param {string} [props.dataBsToggle] - Atributo data-bs-toggle para integración con modales Bootstrap.
 * @param {string} [props.dataBsTargetView] - Selector del modal de vista.
 * @param {string} [props.dataBsTargetUpdate] - Selector del modal de actualización.
 * @param {string} [props.dataBsTargetDelete] - Selector del modal de eliminación.
 * @param {boolean} [props.deleteButton=false] - Muestra el botón de eliminar si es true.
 * @returns {JSX.Element} Cuerpo de tabla renderizado con todas las filas y columnas.
 */
export const TableBody = ({
  data,
  columns,
  hideActions,
  renderRowActions,
  handleView,
  handleUpdate,
  handleDelete,
  dataBsToggle,
  dataBsTargetView,
  dataBsTargetUpdate,
  dataBsTargetDelete,
  deleteButton
}) => {
  return (
    <tbody className="table-body">
      {data.map((row, i) => (
        <TableRow
          key={i}
          row={row}
          index={i}
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
      ))}
    </tbody>
  );
};


import React from 'react';
import { TableCell } from './TableCell';
import { ActionsCell } from './ActionsCell';

/**
 * TableRow
 * Componente encargado de renderizar una fila de tabla, iterando sobre las columnas y renderizando una celda por cada columna.
 * Utiliza el componente TableCell para renderizar cada celda, pasando los datos, índice, columnas, y las funciones de acción si se requieren.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.row - Objeto de datos correspondientes a la fila actual.
 * @param {number} props.index - Índice de la fila actual (para numeración cuando aplica).
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
 * @returns {JSX.Element} Fila de tabla renderizada con todas las celdas y acciones.
 */
export const TableRow = ({
  row,
  index,
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
    <tr>
      {columns.map((col) => (
        <td key={String(col.accessor)} title={row[col.accessor] || ''}>
          <TableCell col={col} row={row} index={index} />
        </td>
      ))}
      {!hideActions && (
        <td>
          <ActionsCell
            row={row}
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
        </td>
      )}
    </tr>
  );
};


import React from 'react';
import { ButtonDeactivate, ButtonDelete, ButtonIcon, ButtonInfo } from "../../";

/**
 * ActionsCell
 * Componente encargado de renderizar las acciones de una fila de tabla.
 * Utiliza los componentes ButtonDeactivate, ButtonDelete, ButtonIcon y ButtonInfo para renderizar los botones de acción.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.row - Objeto de datos correspondientes a la fila actual.
 * @param {Function} [props.renderRowActions] - Función render-prop para renderizar las acciones por fila.
 * @param {Function} [props.handleView] - Función callback para la acción de vista.
 * @param {Function} [props.handleUpdate] - Función callback para la acción de update.
 * @param {Function} [props.handleDelete] - Función callback para la acción de delete.
 * @param {string} [props.dataBsToggle] - Atributo data-bs-toggle para integración con modales Bootstrap.
 * @param {string} [props.dataBsTargetView] - Selector del modal de vista.
 * @param {string} [props.dataBsTargetUpdate] - Selector del modal de actualización.
 * @param {string} [props.dataBsTargetDelete] - Selector del modal de eliminación.
 * @param {boolean} [props.deleteButton=false] - Muestra el botón de eliminar si es true.
 * @returns {JSX.Element} Celda de acciones de tabla renderizada con los botones de acción.
 */
export const ActionsCell = ({
  row,
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
    <div className="table-body-actions">
      {renderRowActions ? (
        renderRowActions(row)
      ) : (
        <>
          {handleView && (
            <ButtonInfo
              id={String(row.id)}
              onClick={() => handleView?.(row)}
              className="action-btn--info"
              dataBsToggle={dataBsToggle}
              dataBsTarget={dataBsTargetView}
            />
          )}
          {handleUpdate && (  
            <ButtonIcon
              id={String(row.id)}
              icon="fa-pen-to-square"
              parentMethod={() => handleUpdate?.(row)}
              dataBsToggle={dataBsToggle}
              dataBsTarget={dataBsTargetUpdate}
            />
          )}
          {handleDelete && !deleteButton && (
            <ButtonDeactivate
              id={String(row.id)}
              onClick={() => handleDelete?.(row)}
              dataBsToggle={dataBsToggle}
              dataBsTarget={dataBsTargetDelete}
              handleDelete={handleDelete}
            />
          )}
          {deleteButton && (
            <ButtonDelete
              id={String(row.id)}
              onClick={() => handleDelete?.(row)}
              dataBsToggle={dataBsToggle}
              dataBsTarget={dataBsTargetDelete}
              handleDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
};


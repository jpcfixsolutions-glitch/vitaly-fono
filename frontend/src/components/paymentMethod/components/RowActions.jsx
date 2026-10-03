import { ButtonDeactivate, ButtonIcon, ButtonReactivate, Loading } from '../../';

/**
 * Componente que renderiza las acciones disponibles para cada fila de paciente:
 * - Editar método de pago
 *
 * @component
 * @param {Object} props
 * @param {Object} props.row - Objeto de datos del paciente para la fila actual.
 * @param {Function} props.setUpdateData - Función para preparar la edición del paciente.
 * @param {Object} props.inactive - Objeto con las propiedades de la inactividad.
 * @param {boolean} props.inactive.showInactive - Indica si se deben mostrar las acciones de reactivación.
 * @param {string} props.inactive.reactivatingId - ID del método de pago que se está reactivando.
 * @param {Function} props.inactive.onReactivate - Función para reactivar el método de pago.
 * @returns {JSX.Element}
 */
export const RowActions = ({ row, setUpdateData, setDeactivateData, inactive }) => (
  <>
    {row.status === "Activo" && (
      <>
        <ButtonIcon
          id={String(row.id)}
          icon="fa-pen-to-square"
          parentMethod={() => setUpdateData(row)}
          dataBsToggle="modal"
          dataBsTarget="#updatePaymentMethodModal"
        />
        <ButtonDeactivate
          id={String(row.id)}
          onClick={() => setDeactivateData(row)}
          dataBsToggle="modal"
          dataBsTarget="#deactivatePaymentMethodModal"
        />
      </>
    )}

    {inactive.showInactive && (
      <>
        <ButtonReactivate
          id={`${row.id}`}
          onClick={() => inactive.onReactivate(row)}
          title="Reactivar"
          disabled={inactive.reactivatingId === row.id}
        />
        {inactive.reactivatingId === row.id && <Loading className="mini-loading" />}
      </>
    )}
  </>
);


import { ButtonIcon, ButtonChangePassword, ButtonDeactivate, ButtonReactivate, Loading } from "../..";


/**
 * Componente de acciones por fila para usuarios, muestra los botones de editar, cambiar contraseña,
 * dar de baja, o reactivar usuario según el estado del usuario y las propiedades recibidas.
 *
 * @param {Object} props - Propiedades del componente RowActions.
 * @param {Object} props.row - Objeto de usuario de la fila actual, requiere el campo 'id' y 'status'.
 * @param {Function} props.setDataUpdateUser - Función para establecer el usuario a actualizar (abrir modal editar).
 * @param {Function} props.setDataChangePassword - Función para establecer el usuario a cambiar contraseña (abrir modal cambiar contraseña).
 * @param {Function} props.setDataDeactivate - Función para establecer el usuario a dar de baja (abrir modal baja usuario).
 * @param {Object} props.inactive - Propiedades relacionadas con usuarios inactivos; debe incluir:
 *   @param {boolean} props.inactive.showInactive - Si se muestran o no acciones para usuarios inactivos.
 *   @param {Function} props.inactive.onReactivate - Función para reactivar usuario.
 *   @param {number|null} props.inactive.reactivatingId - Id del usuario que se está reactivando actualmente o null.
 *
 * @returns {JSX.Element} Elementos de acción acorde al estado del usuario.
 */
export const RowActions = ({
  row,
  setDataUpdateUser,
  setDataChangePassword,
  setDataDeactivate,
  inactive
}) => (
  <>
    {row.status === "Activo" && (
      <>
        <ButtonIcon
          id={String(row.id)}
          icon="fa-pen-to-square"
          parentMethod={() => setDataUpdateUser(row)}
          dataBsToggle="modal"
          dataBsTarget="#updateUserModal"
        />
        <ButtonChangePassword
          id={`change-password-${row.id}`}
          onClick={() => setDataChangePassword(row)}
          dataBsToggle="modal"
          dataBsTarget="#changePasswordModal"
        />
        <ButtonDeactivate
          id={String(row.id)}
          onClick={() => setDataDeactivate(row)}
          dataBsToggle="modal"
          dataBsTarget="#deactivateUserModal"
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

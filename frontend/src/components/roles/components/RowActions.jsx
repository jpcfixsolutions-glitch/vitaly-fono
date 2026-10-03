import { ButtonIcon, ButtonDeactivate, ButtonReactivate, Loading } from "../..";

/**
 * Acciones por fila para roles: editar y dar de baja.
 */
export const RowActions = ({ 
  row, 
  setDataUpdateRole, 
  setDataDeactivate, 
  inactive 
}) => (
  <>
    {row.status === "Activo" && (
      <>
        <ButtonIcon
          id={String(row.id)}
          icon="fa-pen-to-square"
          parentMethod={() => setDataUpdateRole(row)}
          dataBsToggle="modal"
          dataBsTarget="#updateRoleModal"
        />
        <ButtonDeactivate
          id={String(row.id)}
          onClick={() => setDataDeactivate(row)}
          dataBsToggle="modal"
          dataBsTarget="#deactivateRoleModal"
        />
      </>
    )}

    {inactive.showInactive && (
      <>
        <ButtonReactivate
          id={`${row.id}`}
          onClick={() => { inactive.onReactivate(row) }}
          title="Reactivar"
          disabled={inactive.reactivatingId === row.id}
        />
        {inactive.reactivatingId === row.id && <Loading className="mini-loading" />}
      </>
    )}
  </>
);

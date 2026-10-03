import { ButtonDeactivate, ButtonIcon, ButtonReactivate, Loading } from "../../";

/**
 * Acciones por fila para obras sociales: editar, dar de baja o reactivar.
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
          dataBsTarget="#updateObraSocialModal"
        />
        <ButtonDeactivate
          id={String(row.id)}
          onClick={() => setDeactivateData(row)}
          dataBsToggle="modal"
          dataBsTarget="#deactivateObraSocialModal"
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

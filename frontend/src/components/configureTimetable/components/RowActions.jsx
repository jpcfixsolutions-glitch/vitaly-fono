import { ButtonIcon, ButtonDelete } from "../..";

/**
 * Acciones por fila para configuraciones horarias: editar y eliminar.
 */
export const RowActions = ({ row, setUpdateData, setDeleteData }) => (
  <>
    <ButtonIcon
      id={String(row.id)}
      icon="fa-pen-to-square"
      parentMethod={() => setUpdateData(row)}
      dataBsToggle="modal"
      dataBsTarget="#updateConfigurationTimetableModal"
    />
    <ButtonDelete
      id={String(row.id)}
      onClick={() => setDeleteData(row)}
      dataBsToggle="modal"
      dataBsTarget="#deleteConfigurationTimetableModal"
    />
  </>
);

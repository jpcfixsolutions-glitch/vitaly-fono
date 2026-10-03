import { useState } from "react";
import { Subsection, ModalDelete, ModalPost, ModalUpdate, ViewData, Button } from "../";
import { FormConfigurationTimetable, configurationTimetableColumns, RowActions } from "./components";
import {
  useGetAllConfigurationTimetable,
  useSubmitPostConfigurationTimetable,
  useSubmitUpdateConfigurationTimetable,
  useSubmitDeleteConfigurationTimetable
} from "./hooks";
import { Info } from "lucide-react";

import "./configureTimetable.css";

export const ConfigureTimetable = () => {
  const [dataUpdateConfigurationTimetable, setDataUpdateConfigurationTimetable] = useState(null);
  const [dataDeleteConfigurationTimetable, setDataDeleteConfigurationTimetable] = useState(null);

  const {
    configurations: dataConfigurationTimetableGet,
    loading: apiLoadingGetConfigurationTimetableGet,
    error: apiErrorGetConfigurationTimetableGet
  } = useGetAllConfigurationTimetable({
    url: "/configuraciones-calendario",
    method: "GET",
    autoFetch: true
  });

  const {
    successMessage,
    errorMessage,
    apiLoadingPostConfigurationTimetable,
    apiErrorPostConfigurationTimetable,
    onSubmitConfigurationTimetable
  } = useSubmitPostConfigurationTimetable(dataConfigurationTimetableGet?.data);

  const {
    successMessage: successMessageUpdateConfigurationTimetable,
    errorMessage: errorMessageUpdateConfigurationTimetable,
    isLoading: isLoadingUpdateConfigurationTimetable,
    apiLoadingUpdateConfigurationTimetable,
    apiErrorUpdateConfigurationTimetable,
    onUpdateConfigurationTimetable
  } = useSubmitUpdateConfigurationTimetable(dataUpdateConfigurationTimetable);

  const {
    successMessage: successMessageDeleteConfigurationTimetable,
    errorMessage: errorMessageDeleteConfigurationTimetable,
    isLoading: isLoadingDeleteConfigurationTimetable,
    apiLoadingDeleteConfigurationTimetable,
    apiErrorDeleteConfigurationTimetable,
    onDeleteConfigurationTimetable
  } = useSubmitDeleteConfigurationTimetable(dataDeleteConfigurationTimetable);

  return (
    <>
      <Subsection
        title="Configurar dias y horarios de atención"
        description="Personaliza los dias y horarios laborables de tu consultorio."
        target="#calendario"
      >
        <span className="hint"><Info />Nota: Puedes tener uno o varios rangos horarios para cada día. Los rangos horarios no especificados, son los que se consideran como no laborables.</span>

        <ViewData
          data={dataConfigurationTimetableGet}
          apiLoading={apiLoadingGetConfigurationTimetableGet}
          apiError={apiErrorGetConfigurationTimetableGet}
          message="No hay configuraciones registradas."
          columns={configurationTimetableColumns}
          title="Configuraciones activas"
          buttonLabel="Crear configuración"
          buttonDataBsTarget="#createConfigurationTimetableModal"
          buttonClassName="btn-configureTimetable"
          dataBsTargetUpdate="#updateConfigurationTimetableModal"
          dataBsTargetDelete="#deleteConfigurationTimetableModal"
          renderRowActions={(row) => (
            <RowActions
              row={row}
              setUpdateData={setDataUpdateConfigurationTimetable}
              setDeleteData={setDataDeleteConfigurationTimetable}
            />
          )}
        />
      </Subsection >

      <ModalPost
        id="createConfigurationTimetableModal"
        title="Crear configuración"
        formId="createConfigurationTimetableForm"
        loading={apiLoadingPostConfigurationTimetable}
      >
        <FormConfigurationTimetable
          idModal="createConfigurationTimetableModal"
          formId="createConfigurationTimetableForm"
          onSubmit={onSubmitConfigurationTimetable}
          loading={apiLoadingPostConfigurationTimetable}
          error={apiErrorPostConfigurationTimetable}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </ModalPost>

      <ModalUpdate
        id="updateConfigurationTimetableModal"
        title="Actualizar configuración"
        formId="updateConfigurationTimetableForm"
        loading={isLoadingUpdateConfigurationTimetable}
      >
        <FormConfigurationTimetable
          idModal="updateConfigurationTimetableModal"
          formId="updateConfigurationTimetableForm"
          onSubmit={onUpdateConfigurationTimetable}
          loading={apiLoadingUpdateConfigurationTimetable || isLoadingUpdateConfigurationTimetable}
          error={apiErrorUpdateConfigurationTimetable}
          errorMessage={errorMessageUpdateConfigurationTimetable}
          successMessage={successMessageUpdateConfigurationTimetable}
          initialValues={dataUpdateConfigurationTimetable || {}}
        />
      </ModalUpdate>

      <ModalDelete
        id="deleteConfigurationTimetableModal"
        title="Eliminar configuración"
        formId="deleteConfigurationTimetableForm"
        loading={isLoadingDeleteConfigurationTimetable}
      >
        <FormConfigurationTimetable
          idModal="deleteConfigurationTimetableModal"
          formId="deleteConfigurationTimetableForm"
          onSubmit={onDeleteConfigurationTimetable}
          loading={apiLoadingDeleteConfigurationTimetable || isLoadingDeleteConfigurationTimetable}
          error={apiErrorDeleteConfigurationTimetable}
          errorMessage={errorMessageDeleteConfigurationTimetable}
          successMessage={successMessageDeleteConfigurationTimetable}
          mode="delete"
          initialValues={dataDeleteConfigurationTimetable || {}}
        />
      </ModalDelete>
    </>
  );
}
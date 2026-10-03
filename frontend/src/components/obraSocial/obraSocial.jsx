import { useState } from "react";
import { Subsection, ModalDelete, ModalPost, ModalUpdate, ViewData } from "../";
import { FormObraSocial, obraSocialColumns, RowActions } from "./components";
import {
  useGetAllObraSocial,
  useSubmitPostObraSocial,
  useSubmitUpdateObraSocial,
  useSubmitDeactivateObraSocial
} from "./hooks";

import "./obraSocial.css";

export const ObraSocial = () => {
  const [dataUpdate, setDataUpdate] = useState(null);
  const [dataDeactivate, setDataDeactivate] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);

  const {
    healthInsurances: dataObraSocial,
    loading: apiLoadingGetObraSocial,
    error: apiErrorGetObraSocial,
    refetch: refetchObraSocial
  } = useGetAllObraSocial({
    url: "/obras-sociales",
    method: "GET",
    autoFetch: true
  });

  const filteredObraSocial = {
    data: Array.isArray(dataObraSocial?.data)
      ? dataObraSocial.data.filter((item) => item.status === (showInactive ? "Inactivo" : "Activo"))
      : []
  };

  const {
    successMessage,
    errorMessage,
    apiLoadingPostObraSocial,
    apiErrorPostObraSocial,
    onSubmitObraSocial
  } = useSubmitPostObraSocial();

  const {
    successMessage: successMessageUpdateObraSocial,
    errorMessage: errorMessageUpdateObraSocial,
    isLoading: isLoadingUpdateObraSocial,
    apiLoadingUpdateObraSocial,
    apiErrorUpdateObraSocial,
    onUpdateObraSocial
  } = useSubmitUpdateObraSocial(dataUpdate);

  const {
    successMessage: successMessageDeactivateObraSocial,
    errorMessage: errorMessageDeactivateObraSocial,
    isLoading: isLoadingDeactivateObraSocial,
    apiLoadingDeactivateObraSocial,
    apiErrorDeactivateObraSocial,
    onDeactivateObraSocial
  } = useSubmitDeactivateObraSocial(dataDeactivate);

  const onReactivate = async (row) => {
    setReactivatingId(row.id);
    const response = await onSubmitObraSocial({ name: row.name });
    if (response?.status === "success") {
      await refetchObraSocial();
      setShowInactive(false);
    }
  };

  return (
    <>
      <Subsection
        title="Obras Sociales"
        description="Configura las opciones de obras sociales aceptadas en tu consultorio para asociarlas a los pacientes"
        target="#obras-sociales"
      >
        <ViewData
          data={filteredObraSocial}
          apiLoading={apiLoadingGetObraSocial}
          apiError={apiErrorGetObraSocial}
          message="No hay obras sociales registradas."
          columns={obraSocialColumns}
          title=""
          buttonLabel="+ Agregar"
          buttonDataBsTarget="#createObraSocialModal"
          buttonClassName="btn-obraSocial"
          subSection={true}
          subSectionHandler={{
            setShowInactive,
            showInactive
          }}
          dataBsTargetUpdate="#updateObraSocialModal"
          dataBsTargetDeactivate="#deactivateObraSocialModal"
          renderRowActions={(row) => (
            <RowActions
              row={row}
              setUpdateData={setDataUpdate}
              setDeactivateData={setDataDeactivate}
              inactive={{
                showInactive,
                reactivatingId,
                onReactivate
              }}
            />
          )}
        />
      </Subsection>

      <ModalPost
        id="createObraSocialModal"
        title="Registro de Obra Social"
        formId="createObraSocialForm"
        loading={apiLoadingPostObraSocial}
      >
        <FormObraSocial
          idModal="createObraSocialModal"
          formId="createObraSocialForm"
          onSubmit={onSubmitObraSocial}
          loading={apiLoadingPostObraSocial}
          error={apiErrorPostObraSocial}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </ModalPost>

      <ModalUpdate
        id="updateObraSocialModal"
        title="Editar Obra Social"
        formId="updateObraSocialForm"
        loading={isLoadingUpdateObraSocial}
      >
        <FormObraSocial
          idModal="updateObraSocialModal"
          formId="updateObraSocialForm"
          onSubmit={onUpdateObraSocial}
          loading={apiLoadingUpdateObraSocial || isLoadingUpdateObraSocial}
          error={apiErrorUpdateObraSocial}
          errorMessage={errorMessageUpdateObraSocial}
          successMessage={successMessageUpdateObraSocial}
          initialValues={dataUpdate || {}}
        />
      </ModalUpdate>

      <ModalDelete
        id="deactivateObraSocialModal"
        title="Dar de baja la obra social"
        formId="deactivateObraSocialForm"
        loading={isLoadingDeactivateObraSocial}
        buttonLabel="Dar de baja"
        buttonLoadingLabel="Dando de baja..."
      >
        <FormObraSocial
          idModal="deactivateObraSocialModal"
          formId="deactivateObraSocialForm"
          onSubmit={onDeactivateObraSocial}
          loading={apiLoadingDeactivateObraSocial || isLoadingDeactivateObraSocial}
          error={apiErrorDeactivateObraSocial}
          errorMessage={errorMessageDeactivateObraSocial}
          successMessage={successMessageDeactivateObraSocial}
          mode="delete"
          initialValues={dataDeactivate || {}}
        />
      </ModalDelete>
    </>
  );
};
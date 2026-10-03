import { useState } from "react";
import { Subsection, ModalDelete, ModalPost, ModalUpdate, ViewData } from "..";

import { useGetAllTypeService } from "../../hooks";

import { FormTypeService, typeServiceColumns, RowActions } from "./components";
import {
  useSubmitPostTypeService,
  useSubmitUpdateTypeService,
  useSubmitDeactivateTypeService
} from "./hooks";

import "./typeServices.css";

export const TypeService = () => {
  const [dataUpdate, setDataUpdate] = useState(null);
  const [dataDeactivate, setDataDeactivate] = useState(null);

  const [showInactive, setShowInactive] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);

  const {
    typeServices: dataTypeService,
    loading: apiLoadingGetTypeService,
    error: apiErrorGetTypeService,
    refetch: refetchTypeService
  } = useGetAllTypeService({
    url: "/tipo-servicio",
    method: "GET",
    autoFetch: true
  });

  const filteredTypeService = {
    data: Array.isArray(dataTypeService?.data)
      ? dataTypeService.data.filter((item) => item.status === (showInactive ? "Inactivo" : "Activo"))
      : []
  };

  const {
    successMessage,
    errorMessage,
    apiLoadingPostTypeService,
    apiErrorPostTypeService,
    onSubmitTypeService
  } = useSubmitPostTypeService();

  const {
    successMessage: successMessageUpdateTypeService,
    errorMessage: errorMessageUpdateTypeService,
    isLoading: isLoadingUpdateTypeService,
    apiLoadingUpdateTypeService,
    apiErrorUpdateTypeService,
    onUpdateTypeService
  } = useSubmitUpdateTypeService(dataUpdate);

  const {
    successMessage: successMessageDeactivateTypeService,
    errorMessage: errorMessageDeactivateTypeService,
    isLoading: isLoadingDeactivateTypeService,
    apiLoadingDeactivateTypeService,
    apiErrorDeactivateTypeService,
    onDeactivateTypeService
  } = useSubmitDeactivateTypeService(dataDeactivate);

  const onReactivate = async (row) => {
    setReactivatingId(row.id);
    const response = await onSubmitTypeService({
      name: row.name,
      description: row.description || "",
      price: row.price
    });
    if (response?.status === "success") {
      await refetchTypeService();
      setShowInactive(false);
    }
  };

  return (
    <>
      <Subsection
        title="Tipos de servicio"
        description="Personaliza el catálogo de servicios y prestaciones que ofreces en tu consultorio"
        target="#tipos-de-servicio"
      >
        <ViewData
          data={filteredTypeService}
          apiLoading={apiLoadingGetTypeService}
          apiError={apiErrorGetTypeService}
          message="No hay tipos de servicio registrados."
          columns={typeServiceColumns}
          title=""
          classNameEspecificTable="table-type-services"
          buttonLabel="+ Agregar"
          buttonDataBsTarget="#createTypeServiceModal"
          buttonClassName="btn-typeService"
          subSection={true}
          subSectionHandler={{
            setShowInactive,
            showInactive
          }}
          dataBsTargetUpdate="#updateTypeServiceModal"
          dataBsTargetDeactivate="#deactivateTypeServiceModal"
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
        id="createTypeServiceModal"
        title="Agregar nuevo tipo de servicio"
        formId="createTypeServiceForm"
        loading={apiLoadingPostTypeService}
      >

        <FormTypeService
          idModal="createTypeServiceModal"
          formId="createTypeServiceForm"
          onSubmit={onSubmitTypeService}
          loading={apiLoadingPostTypeService}
          error={apiErrorPostTypeService}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

      </ModalPost>

      <ModalUpdate
        id="updateTypeServiceModal"
        title="Actualizar tipo de servicio"
        formId="updateTypeServiceForm"
        loading={isLoadingUpdateTypeService}
      >
        <FormTypeService
          idModal="updateTypeServiceModal"
          formId="updateTypeServiceForm"
          onSubmit={onUpdateTypeService}
          loading={apiLoadingUpdateTypeService || isLoadingUpdateTypeService}
          error={apiErrorUpdateTypeService}
          errorMessage={errorMessageUpdateTypeService}
          successMessage={successMessageUpdateTypeService}
          initialValues={dataUpdate || {}}
        />

      </ModalUpdate>

      <ModalDelete
        id="deactivateTypeServiceModal"
        title="Dar de baja tipo de servicio"
        formId="deactivateTypeServiceForm"
        loading={isLoadingDeactivateTypeService}
        buttonLabel="Dar de baja"
        buttonLoadingLabel="Dando de baja..."
      >
        <FormTypeService
          idModal="deactivateTypeServiceModal"
          formId="deactivateTypeServiceForm"
          onSubmit={onDeactivateTypeService}
          loading={apiLoadingDeactivateTypeService || isLoadingDeactivateTypeService}
          error={apiErrorDeactivateTypeService}
          errorMessage={errorMessageDeactivateTypeService}
          successMessage={successMessageDeactivateTypeService}
          mode="delete"
          initialValues={dataDeactivate || {}}
        />
      </ModalDelete>
    </>
  );
}
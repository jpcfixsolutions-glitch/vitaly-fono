import { useState } from "react";
import { Subsection, ModalDelete, ModalPost, ModalUpdate, ViewData } from "../";
import { useGetAllPaymentMethod } from "../../hooks/useGetAllPaymentMethod";
import { FormPaymentMethod, paymentMethodColumns, RowActions } from "./components";
import { useSubmitPostPaymentMethod, useSubmitUpdatePaymentMethod, useSubmitDeactivatePaymentMethod } from "./hooks";

import "./paymentMethod.css";


export const PaymentMethod = () => {
  const [dataUpdate, setDataUpdate] = useState(null);
  const [dataDeactivate, setDataDeactivate] = useState(null);

  const [showInactive, setShowInactive] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);

  // Hook personalizado para obtener todos los métodos de pago
  const {
    paymentMethods: dataPaymentMethod,
    loading: apiLoadingGetPaymentMethod,
    error: apiErrorGetPaymentMethod,
    refetch: refetchPaymentMethod // ToDo: debería usarlo despues del post, update.
  } = useGetAllPaymentMethod({ 
    url: "/metodo-pago", 
    method: "GET", 
    autoFetch: true 
  });

  // Filtrar los métodos de pago por estado
  const filteredPaymentMethod = {
    data: Array.isArray(dataPaymentMethod?.data)
      ? dataPaymentMethod.data.filter(item => item.status === (showInactive ? 'Inactivo' : 'Activo'))
      : []
  };

  // Hook personalizado para enviar el formulario de creación de método de pago
  const {
    successMessage,
    errorMessage,
    apiLoadingPostPaymentMethod,
    apiErrorPostPaymentMethod,
    onSubmitPaymentMethod,
  } = useSubmitPostPaymentMethod();

  // Hook personalizado para enviar el formulario de actualización de método de pago
  const {
    successMessage: successMessageUpdatePaymentMethod,
    errorMessage: errorMessageUpdatePaymentMethod,
    isLoading: isLoadingUpdatePaymentMethod,
    apiLoadingUpdatePaymentMethod,
    apiErrorUpdatePaymentMethod,
    onUpdatePaymentMethod,
  } = useSubmitUpdatePaymentMethod(dataUpdate);

  // Hook personalizado para enviar el formulario de dar de baja de método de pago
  const {
    successMessage: successMessageDeactivatePaymentMethod,
    errorMessage: errorMessageDeactivatePaymentMethod,
    isLoading: isLoadingDeactivatePaymentMethod,
    apiLoadingDeactivatePaymentMethod,
    apiErrorDeactivatePaymentMethod,
    onDeactivatePaymentMethod,
  } = useSubmitDeactivatePaymentMethod(dataDeactivate);

  // Manejador para reactivar un método de pago
  const onReactivate = async (row) => {
    setReactivatingId(row.id);
    const response = await onSubmitPaymentMethod({ name: row.name });
    if (response?.status === "success") {
      await refetchPaymentMethod();
      setShowInactive(false);
    }
  };

  return (
    <>
      <Subsection
        title="Métodos de pago"
        description="Configura las opciones de pago aceptadas en tu consultorio para agilizar la facturación"
        target="#metodos-de-pago"
      >
        <ViewData
          data={filteredPaymentMethod}
          apiLoading={apiLoadingGetPaymentMethod}
          apiError={apiErrorGetPaymentMethod}
          message="No hay métodos de pago registrados."
          columns={paymentMethodColumns}
          title=""
          buttonLabel="+ Agregar"
          buttonDataBsTarget="#createPaymentMethodModal"
          buttonClassName="btn-paymentMethod"
          subSection={true}
          subSectionHandler={{
            setShowInactive,
            showInactive
          }}
          dataBsTargetUpdate="#updatePaymentMethodModal"
          dataBsTargetDeactivate="#deactivatePaymentMethodModal"
          renderRowActions={(row) => (
            <RowActions
              row={row}
              setUpdateData={setDataUpdate}
              setDeactivateData={setDataDeactivate}
              inactive={
                {
                  showInactive,
                  reactivatingId,
                  onReactivate
                }
              }
            />
          )}
        />
      </Subsection>

      <ModalPost
        id="createPaymentMethodModal"
        title="Agregar nuevo método de pago"
        formId="createPaymentMethodForm"
        loading={apiLoadingPostPaymentMethod}
      >
        <FormPaymentMethod
          idModal="createPaymentMethodModal"
          formId="createPaymentMethodForm"
          onSubmit={onSubmitPaymentMethod}
          loading={apiLoadingPostPaymentMethod}
          error={apiErrorPostPaymentMethod}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </ModalPost>

      <ModalUpdate
        id="updatePaymentMethodModal"
        title="Actualizar método de pago"
        formId="updatePaymentMethodForm"
        loading={isLoadingUpdatePaymentMethod}
      >
        <FormPaymentMethod
          idModal="updatePaymentMethodModal"
          formId="updatePaymentMethodForm"
          onSubmit={onUpdatePaymentMethod}
          loading={apiLoadingUpdatePaymentMethod || isLoadingUpdatePaymentMethod}
          error={apiErrorUpdatePaymentMethod}
          errorMessage={errorMessageUpdatePaymentMethod}
          successMessage={successMessageUpdatePaymentMethod}
          initialValues={dataUpdate || {}}
        />
      </ModalUpdate>

      <ModalDelete
        id="deactivatePaymentMethodModal"
        title="Dar de baja método de pago"
        formId="deactivatePaymentMethodForm"
        loading={isLoadingDeactivatePaymentMethod}
        buttonLabel="Dar de baja"
        buttonLoadingLabel="Dando de baja..."
      >
        <FormPaymentMethod
          idModal="deactivatePaymentMethodModal"
          formId="deactivatePaymentMethodForm"
          onSubmit={onDeactivatePaymentMethod}
          loading={apiLoadingDeactivatePaymentMethod || isLoadingDeactivatePaymentMethod}
          error={apiErrorDeactivatePaymentMethod}
          errorMessage={errorMessageDeactivatePaymentMethod}
          successMessage={successMessageDeactivatePaymentMethod}
          mode="delete"
          initialValues={dataDeactivate || {}}
        />
      </ModalDelete>
    </>
  );
}
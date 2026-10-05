import { useState } from "react";
import { ButtonDeactivate, Form, Input, ModalDelete, ModalPost, Subsection, ViewData } from "../";
import { useApi, useGet } from "../../hooks";
import { closeModal } from "../../utils";
import { getUser } from "../../utils/getUser";

import "./documentType.css";

const columns = [{ header: "Tipo de documento", accessor: "name" }];

const DocumentTypeForm = ({ idModal, formId, onSubmit, loading, errorMessage, successMessage }) => (
  <Form
    idModal={idModal}
    formId={formId}
    onSubmit={onSubmit}
    loading={loading}
    errorMessage={errorMessage}
    successMessage={successMessage}
  >
    {({ control, errors }) => (
      <Input
        name="name"
        label="Nombre del tipo de documento"
        control={control}
        errors={errors}
        type="text"
        rules={{
          required: "El nombre del tipo de documento es requerido.",
          minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres." },
          pattern: {
            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.-]+$/,
            message: "Solo se permiten letras, números, espacios, puntos y guiones."
          }
        }}
      />
    )}
  </Form>
);

export const DocumentType = () => {
  const [showInactive, setShowInactive] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [createMessage, setCreateMessage] = useState({ error: null, success: null });
  const [deactivateMessage, setDeactivateMessage] = useState({ error: null, success: null });

  const { dataGet, loading, error, refetch } = useGet({
    url: "/tipos-documento",
    method: "GET",
    autoFetch: true,
    needFilterByStatus: false,
    needFilterByUser: false
  });
  const { trigger: createDocumentType, loading: creating } = useApi({
    url: "/tipos-documento",
    method: "POST"
  });
  const { trigger: deactivateDocumentType, loading: deactivating } = useApi({
    id: selectedDocumentType?.id,
    url: "/tipos-documento",
    method: "DELETE"
  });

  const documentTypes = {
    data: Array.isArray(dataGet?.data)
      ? dataGet.data.filter((item) => item.status === (showInactive ? "Inactivo" : "Activo"))
      : []
  };

  const handleCreate = async ({ name }) => {
    setCreateMessage({ error: null, success: null });
    const response = await createDocumentType({ name: name.trim(), id_user: getUser()?.id });

    if (response?.status === "success") {
      setCreateMessage({ error: null, success: "Tipo de documento creado correctamente." });
      await refetch();
      setTimeout(() => closeModal("createDocumentTypeModal"), 1000);
      return;
    }

    setCreateMessage({ error: response?.message || "No se pudo crear el tipo de documento.", success: null });
  };

  const handleDeactivate = async () => {
    setDeactivateMessage({ error: null, success: null });
    const response = await deactivateDocumentType();

    if (response?.status === "success") {
      setDeactivateMessage({ error: null, success: "Tipo de documento dado de baja correctamente." });
      await refetch();
      setTimeout(() => closeModal("deactivateDocumentTypeModal"), 1000);
      return;
    }

    setDeactivateMessage({ error: response?.message || "No se pudo dar de baja el tipo de documento.", success: null });
  };

  return (
    <>
      <Subsection
        title="Tipo de documentos"
        description="Administra los tipos de documentos disponibles para registrar pacientes y turnos."
        target="#tipos-de-documento"
      >
        <ViewData
          data={documentTypes}
          apiLoading={loading}
          apiError={error}
          message="No hay tipos de documento registrados."
          columns={columns}
          title=""
          buttonLabel="+ Agregar"
          buttonDataBsTarget="#createDocumentTypeModal"
          buttonClassName="btn-document-type"
          subSection={true}
          subSectionHandler={{ setShowInactive, showInactive }}
          dataBsTargetDeactivate="#deactivateDocumentTypeModal"
          renderRowActions={(row) => row.status === "Activo" && (
            <ButtonDeactivate
              id={String(row.id)}
              onClick={() => setSelectedDocumentType(row)}
              dataBsToggle="modal"
              dataBsTarget="#deactivateDocumentTypeModal"
            />
          )}
        />
      </Subsection>

      <ModalPost
        id="createDocumentTypeModal"
        title="Agregar tipo de documento"
        formId="createDocumentTypeForm"
        loading={creating}
        buttonLabel="Agregar"
        buttonLabelLoading="Agregando..."
      >
        <DocumentTypeForm
          idModal="createDocumentTypeModal"
          formId="createDocumentTypeForm"
          onSubmit={handleCreate}
          loading={creating}
          errorMessage={createMessage.error}
          successMessage={createMessage.success}
        />
      </ModalPost>

      <ModalDelete
        id="deactivateDocumentTypeModal"
        title="Inactivar tipo de documento"
        formId="deactivateDocumentTypeForm"
        loading={deactivating}
        buttonLabel="Inactivar"
        buttonLoadingLabel="Inactivando..."
      >
        <Form
          idModal="deactivateDocumentTypeModal"
          formId="deactivateDocumentTypeForm"
          onSubmit={handleDeactivate}
          loading={deactivating}
          errorMessage={deactivateMessage.error}
          successMessage={deactivateMessage.success}
        >
          {() => <p>¿Querés inactivar el tipo de documento <strong>“{selectedDocumentType?.name}”</strong>?</p>}
        </Form>
      </ModalDelete>
    </>
  );
};

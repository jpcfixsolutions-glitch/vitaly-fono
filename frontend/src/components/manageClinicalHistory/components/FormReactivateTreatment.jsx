
import { Form } from "../../form";

export const FormReactivateTreatment = ({
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  initialValues = undefined,
}) => {
  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      successMessage={successMessage}
      initialValues={initialValues}
    >
      {({ control, errors, setValue }) => (
        <>
          <div>
            <p>
              ¿Estás seguro de querer <strong>reactivar</strong> el tratamiento del paciente{" "}
              <strong>"{initialValues?.name} {initialValues?.last_name}"</strong>?
            </p>
          </div>
        </>
      )}
    </Form>
  );
};

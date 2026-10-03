import { Form } from "../../";
import { SectionFormPersonalDataForAdults } from "./sectionFormPersonalDataForAdults";
import { SectionAntecedentDataForAdults } from "./sectionAntecedentDataForAdults";
import { mapPatientToFirstInterviewInitialValues } from "../../../utils/format";

/**
 * Componente de formulario para registrar la primera entrevista
 */
export const FormFirstInterview = ({
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  initialValues = null,
  isUpdate = false, // Prop para indicar si es edición
}) => {
  // Si es update, usamos initialValues directamente (ya mapeados externamente)
  // Si es create, mapeamos desde el paciente
  const mappedInitialValues = isUpdate 
    ? initialValues 
    : mapPatientToFirstInterviewInitialValues(initialValues);

  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      successMessage={successMessage}
      initialValues={mappedInitialValues}
      className="first-interview-form"
    >
      {({ control, errors }) => (
        <>
          <SectionFormPersonalDataForAdults 
            control={control} 
            errors={errors} 
            formId={formId}
          />
          <SectionAntecedentDataForAdults
            control={control} 
            errors={errors} 
            formId={formId}
          />
        </>
      )}
    </Form>
  );
};

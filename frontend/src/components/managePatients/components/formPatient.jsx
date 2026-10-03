import { useMemo } from 'react';
import { Input, Select, Form } from "../../";
import { MessageInactive } from '../../ui/inactive/MessageInactive';
import '../managePatients.css';
import { transformPatientInitialValues } from '../utils/transformInitialValues';

/**
 * Componente de formulario para pacientes
 */
export const FormPatient = ({
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  documentTypes = [],
  healthInsurance = [],
  initialValues = undefined,
  disabled = false,
  users = [],
  isReception = false,
}) => {
  // Si el paciente está inactivo bloquear la edición del registro.
  const isInactive = initialValues?.status === "Inactivo" || initialValues?.status === false;

  // Transformar initialValues con fecha formateada y mapear a UUIDs, memorizado
  const transformedInitialValues = useMemo(() => {
    return transformPatientInitialValues(initialValues, documentTypes, healthInsurance);
  }, [initialValues, documentTypes, healthInsurance]);

  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      successMessage={successMessage}
      initialValues={transformedInitialValues}
      disabled={disabled}
    >
      {({ control, errors }) => (
        <>
          {isInactive && (
            <MessageInactive message="No se puede modificar la información del paciente debido a que se encuentra en estado 'Inactivo'" />
          )}
          {isReception && (
            <Select
              name="id_user"
              label="Profesional a cargo *"
              control={control}
              errors={errors}
              options={users}
              valueKey="value"
              labelKey="label"
              placeholder="Selecciona un profesional"
              disabled={isInactive || disabled}
              rules={{ required: "El profesional a cargo es requerido." }}
            />
          )}
          <Input
            name="name"
            label="Nombre *"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
            type="text"
            rules={{ required: "El nombre es requerido." }}
          />
          <Input
            name="last_name"
            label="Apellido *"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
            type="text"
            rules={{ required: "El apellido es requerido." }}
          />
          <Select
            name="id_document_type"
            label="Tipo de documento *"
            control={control}
            errors={errors}
            options={documentTypes} 
            valueKey="value"
            labelKey="label"
            placeholder="Selecciona un tipo de documento"
            disabled={isInactive || disabled}
            rules={{ required: "El tipo de documento es requerido." }}
          />
          <Input
            name="document_number"
            label="Número de documento *"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
            type="text"
            rules={{ required: "El número de documento es requerido.", minLength: { value: 8, message: "Mínimo 8 caracteres." } }}
          />
          <Input
            name="phone"
            label="Teléfono *"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
            type="text"
            rules={{ required: "El teléfono es requerido." }}
          />
          <Input
            name="birth_date"
            label="Fecha de nacimiento"
            type="date"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
          />
          <Input
            name="email"
            label="Email"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
            type="email"
            rules={{ pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: "Email inválido" } }}
          />
          <Input
            name="address"
            label="Dirección"
            control={control}
            errors={errors}
            disabled={isInactive || disabled}
            type="text"
          />
          <Select
            name="id_health_insurance"
            label="Obra social"
            control={control}
            errors={errors}
            options={healthInsurance} 
            valueKey="value"
            labelKey="label"
            placeholder="Selecciona una obra social"
            disabled={isInactive || disabled}
          />
        </>
      )}
    </Form>
  );
};
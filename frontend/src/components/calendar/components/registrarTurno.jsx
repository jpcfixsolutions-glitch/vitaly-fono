import { Form, Input, ChoiceCheckboxes, SingleCheckbox, Select } from "../../form";
import { PatientNameAutocomplete } from "../../autocomplete";
import "./registrarTurno.css";
import { InfoIcon } from "lucide-react";

const getDocumentNumberRules = (documentTypes, documentTypeId) => {
  const selectedType = documentTypes.find((type) => type.value === documentTypeId);

  if (selectedType?.label?.toUpperCase() === "DNI") {
    return {
      required: "El número de documento es requerido.",
      minLength: { value: 7, message: "El DNI debe tener entre 7 y 8 números." },
      maxLength: { value: 8, message: "El DNI no puede tener más de 8 números." },
      pattern: { value: /^\d+$/, message: "El DNI solo puede contener números." }
    };
  }

  return { required: "El número de documento es requerido." };
};

const RegistrarTurnoForm = ({
  idModal,
  formId,
  onSubmit,
  loading,
  error,
  errorMessage,
  successMessage,
  initialValues = undefined,
  mode = undefined,
  documentTypes = [],
  users = [],
  isReception = false,
}) => {
  return (
    <>
      <Form
        idModal={idModal}
        formId={formId}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        successMessage={successMessage}
        initialValues={initialValues}
        mode={mode}
      >
        {({ control, errors, setValue, watch }) => (
          <div>
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
                rules={{ required: "Debes seleccionar un profesional." }}
              />
            )}
            <PatientNameAutocomplete control={control} errors={errors} setValue={setValue} watch={watch} />
            <Input
              name="last_name"
              label="Apellido del paciente *"
              control={control}
              errors={errors}
              type="text"
              rules={{
                required: "El apellido del paciente es requerido",
                minLength: { value: 3, message: "El apellido del paciente debe tener al menos 3 caracteres" },
                maxLength: { value: 50, message: "El apellido del paciente no puede tener más de 50 caracteres" },
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/, message: "El apellido solo puede contener letras y espacios" }
              }}
              placeholder="Ej: Perez"
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
              rules={{ required: "El tipo de documento es requerido." }}
            />
            <Input
              name="document_number"
              label="Número de documento *"
              control={control}
              errors={errors}
              type="text"
              rules={getDocumentNumberRules(documentTypes, watch("id_document_type"))}
              placeholder="Ej: 30123456"
            />
            <Input
              name="phone"
              label="Teléfono del paciente *"
              control={control}
              errors={errors}
              type="number"
              rules={{ required: "El teléfono del paciente es requerido" }}
              placeholder="Ej: 1133344455"
            />
            <ChoiceCheckboxes
              name="modality"
              label="Tipo de sesión"
              control={control}
              errors={errors}
              rules={{ required: "El tipo de sesión es requerido" }}
              options={[
                { value: "Presencial", label: "Presencial" },
                { value: "Virtual", label: "Virtual" },
              ]}
              defaultValue="Presencial"
            />
            <Input
              name="date"
              label="Fecha de la consulta *"
              control={control}
              errors={errors}
              type="date"
              rules={{ required: "La fecha de la consulta es requerida" }}
            />
            <Input
              name="time"
              label="Hora de la consulta *"
              control={control}
              errors={errors}
              type="time"
              rules={{ required: "La hora de la consulta es requerida" }}
            />
            <SingleCheckbox
              name="new_patient"
              label="¿Es paciente nuevo?"
              helper="Marcá esta opción si es su primera consulta."
              control={control}
              errors={errors}
            />
            <span className="text-muted" style={{ fontSize: "0.85rem" }}><InfoIcon size={12} style={{ marginBottom: "0.15rem" }} /> Nota: Si el paciente está dado de baja no aparecerá en el autocompletado.</span>

          </div>
        )}
      </Form>
    </>
  );
};

export { RegistrarTurnoForm };

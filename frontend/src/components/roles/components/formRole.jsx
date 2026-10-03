import { InfoIcon } from "lucide-react";
import { Input, Form, MultipleCheckboxes } from "../../";

import '../roles.css';

/**
 * Componente de formulario para roles
 * @param {Object} props - Propiedades del componente
 * @param {string} props.idModal - ID único del modal
 * @param {string} props.formId - ID del formulario asociado al modal
 * @param {Function} props.onSubmit - Función para manejar el envío del formulario
 * @param {boolean} props.loading - Estado de carga de la petición
 * @param {Error|null} props.error - Error ocurrido durante la petición
 * @param {string} props.errorMessage - Mensaje de error personalizado
 * @param {boolean} props.success - Estado de éxito de la petición
 * @param {string} props.successMessage - Mensaje de éxito de la petición
 * @param {Object} props.initialValues - Valores iniciales del formulario
 * @param {string} props.mode - Modo del formulario
 * @param {Array} props.privileges - Array de privilegios disponibles
 * @returns {JSX.Element} Formulario para roles
 */
export const FormRole = ({ idModal, formId, onSubmit, loading, error, errorMessage, success, successMessage, initialValues = undefined, mode = undefined, privileges = [] }) => {
  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      success={success}
      successMessage={successMessage}
      initialValues={initialValues}
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer <strong>dar de baja</strong> el rol <strong>"{initialValues?.name}"</strong>?</p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>  <InfoIcon size={12} style={{ marginBottom: "0.15rem" }} /> Los usuarios con este rol asignado mantendrán sus privilegios, pero no se podrá asignar este rol a nuevos usuarios.</p>
          </div>
        ) : (
          <>
            <Input
              name="name"
              label="Nombre del Rol"
              control={control}
              errors={errors}
              type="text"
              rules={{
                required: "El nombre del rol es requerido.",
                minLength: {
                  value: 3,
                  message: "El nombre del rol debe tener al menos 3 caracteres."
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-()./]+$/,
                  message: "El nombre del rol solo puede contener letras, números, espacios y los símbolos: - ( ) . /"
                }
              }}
            />
            <Input
              name="description"
              label="Descripción del Rol"
              control={control}
              errors={errors}
              type="textarea"
              rules={{
                maxLength: {
                  value: 255,
                  message: "La descripción del rol no puede exceder 255 caracteres."
                }
              }}
            />
            <MultipleCheckboxes
              name="privileges"
              label="Privilegios"
              control={control}
              errors={errors}
              options={privileges.map(privilege => ({
                id: privilege.id,
                name: privilege.name,
                description: privilege.description
              }))}
              rules={{
                required: "Al menos un privilegio es requerido.",
              }}
            />
          </>
        )
      )}
    </Form>
  );
}

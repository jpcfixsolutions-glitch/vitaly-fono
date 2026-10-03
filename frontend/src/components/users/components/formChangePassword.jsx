import { Input, Form } from "../../";

import '../users.css';

/**
 * Componente de formulario para cambiar contraseña
 * @param {Object} props - Propiedades del componente
 * @param {string} props.idModal - ID único del modal
 * @param {string} props.formId - ID del formulario asociado al modal
 * @param {Function} props.onSubmit - Función para manejar el envío del formulario
 * @param {boolean} props.loading - Estado de carga de la petición
 * @param {Error|null} props.error - Error ocurrido durante la petición
 * @param {boolean} props.success - Estado de éxito de la petición
 * @param {string} props.successMessage - Mensaje de éxito de la petición
 * @param {Object} props.initialValues - Valores iniciales del formulario
 * @returns {JSX.Element} Formulario para cambiar contraseña
 */
export const FormChangePassword = ({ idModal, formId, onSubmit, loading, error, success, successMessage, initialValues = undefined }) => {
  const handleSubmit = (formData) => {
    onSubmit(formData);
  };

  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      successMessage={successMessage}
      initialValues={initialValues}
    >
      {({ control, errors }) => (
        <>
          <Input
            name="password"
            formId={formId}
            label="Nueva contraseña *"
            control={control}
            errors={errors}
            type="password"
            rules={{
              required: "La nueva contraseña es requerida.",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres."
              },
              validate: {
                hasLowerCase: (value) =>
                  /[a-z]/.test(value) ||
                  "La contraseña debe contener al menos una letra minúscula.",
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) ||
                  "La contraseña debe contener al menos una letra mayúscula.",
                hasNumber: (value) =>
                  /[0-9]/.test(value) ||
                  "La contraseña debe contener al menos un número.",
                hasSpecialChar: (value) =>
                  /[!@#$%^&*()_+\-={};':"\\|,.<>/?]/.test(value) ||
                  "La contraseña debe contener al menos un carácter especial."
              }
            }}
          />
          <Input
            name="confirmPassword"
            formId={formId}
            label="Confirmar contraseña *"
            control={control}
            errors={errors}
            type="password"
            rules={{
              required: "Debes confirmar la nueva contraseña."
            }}
          />

          <span style={{ color: "#6b7280", fontSize: "0.87rem", display: "block", marginTop: "0.3rem", marginBottom: "0.7rem" }}>
            La contraseña debe tener:
            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
              <li>Al menos 8 caracteres</li>
              <li>Al menos una letra minúscula</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos un número</li>
              <li>Al menos un carácter especial</li>
            </ul>
          </span>
        </>
      )}
    </Form>
  );
}


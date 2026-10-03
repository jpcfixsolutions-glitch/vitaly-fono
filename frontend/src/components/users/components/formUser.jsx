import { InfoIcon } from "lucide-react";
import { Input, Form, Select } from "../../";

import '../users.css';

/**
 * Componente de formulario para usuarios
 * @param {Object} props - Propiedades del componente
 * @param {string} props.idModal - ID único del modal
 * @param {string} props.formId - ID del formulario asociado al modal
 * @param {Function} props.onSubmit - Función para manejar el envío del formulario
 * @param {boolean} props.loading - Estado de carga de la petición
 * @param {Error|null} props.error - Error ocurrido durante la petición
 * @param {boolean} props.success - Estado de éxito de la petición
 * @param {string} props.successMessage - Mensaje de éxito de la petición
 * @param {Object} props.initialValues - Valores iniciales del formulario
 * @param {string} props.mode - Modo del formulario
 * @returns {JSX.Element} Formulario para usuarios
 */
export const FormUser = ({ idModal, formId, onSubmit, loading, error, success, successMessage, initialValues = undefined, mode = undefined, roles = [] }) => {
  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      success={success}
      successMessage={successMessage}
      initialValues={initialValues}
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p> ¿Estás seguro de querer dar de baja al usuario de <strong>"{initialValues?.name} {initialValues?.last_name}"</strong>?</p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}><InfoIcon size={12} style={{ marginBottom: "0.15rem" }} /> Los usuarios dados de baja no podrán acceder al sistema, a menos que sean reactivados. Su historial de trabajo permanecerá en el sistema.</p>
          </div>
        )
          : mode === "update" ? (
            <>
              <Input
                name="name"
                formId={formId}
                label="Nombre del profesional *"
                control={control}
                errors={errors}
                type="text"
                rules={{
                  required: "El nombre del profesional es requerido.",
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                    message: "El nombre del profesional solo puede contener letras, números, espacios y los símbolos: - ( ) ."
                  }
                }}
              />
              <Input
                name="last_name"
                formId={formId}
                label="Apellido del profesional *"
                control={control}
                errors={errors}
                type="text"
                rules={{
                  required: "El apellido del profesional es requerido.",
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                    message: "El apellido del profesional solo puede contener letras, números, espacios y los símbolos: - ( ) ."
                  }
                }}
              />
              <Input
                name="email"
                formId={formId}
                label="Email *"
                control={control}
                errors={errors}
                type="email"
                rules={{
                  required: "El email es requerido.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "El email no es válido."
                  }
                }}
              />
              <Select
                name="id_rol"
                formId={formId}
                label="Rol *"
                control={control}
                errors={errors}
                options={roles}
                rules={{
                  required: "El rol es requerido.",
                }}
              />
            </>
          )
            : (
              <>
                <Input
                  name="name"
                  formId={formId}
                  label="Nombre del profesional *"
                  control={control}
                  errors={errors}
                  type="text"
                  rules={{
                    required: "El nombre del profesional es requerido.",
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                      message: "El nombre del profesional solo puede contener letras, números, espacios y los símbolos: - ( ) ."
                    }
                  }}
                />
                <Input
                  name="last_name"
                  formId={formId}
                  label="Apellido del profesional *"
                  control={control}
                  errors={errors}
                  type="text"
                  rules={{
                    required: "El apellido del profesional es requerido.",
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                      message: "El apellido del profesional solo puede contener letras, números, espacios y los símbolos: - ( ) ."
                    }
                  }}
                />
                <Input
                  name="email"
                  formId={formId}
                  label="Email *"
                  control={control}
                  errors={errors}
                  type="email"
                  rules={{
                    required: "El email es requerido.",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "El email no es válido."
                    }
                  }}
                />
                <Input
                  name="password"
                  formId={formId}
                  label="Contraseña *"
                  control={control}
                  errors={errors}
                  type="password"
                  rules={{
                    required: "La contraseña es requerida.",
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
                <Select
                  name="id_rol"
                  formId={formId}
                  label="Rol *"
                  control={control}
                  errors={errors}
                  options={roles}
                  rules={{
                    required: "El rol es requerido.",
                  }}
                />
                {<span style={{ color: "#6b7280", fontSize: "0.87rem", display: "block", marginTop: "0.3rem", marginBottom: "0.7rem" }}>
                  La contraseña debe tener:
                  <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                    <li>Al menos 8 caracteres</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un carácter especial</li>
                  </ul>
                </span>}
              </>
            )
      )}
    </Form>
  );
}
import { Info, InfoIcon } from "lucide-react";
import { Input, Form } from "../../";

import '../paymentMethod.css';

/**
 * Componente de formulario para métodos de pago
 * @param {Object} props - Propiedades del componente
 * @param {string} props.idModal - ID único del modal
 * @param {string} props.formId - ID del formulario asociado al modal
 * @param {Function} props.onSubmit - Función para manejar el envío del formulario
 * @param {boolean} props.loading - Estado de carga de la petición
 * @param {Error|null} props.error - Error ocurrido durante la petición
 * @param {string} props.errorMessage - Mensaje de error de la petición
 * @param {string} props.successMessage - Mensaje de éxito de la petición
 * @param {Object} props.initialValues - Valores iniciales del formulario
 * @param {string} props.mode - "create" o "update"
 * @returns {JSX.Element} Formulario para métodos de pago
 */
export const FormPaymentMethod = ({ 
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  initialValues = undefined, 
  mode = "create"
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
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer <strong>dar de baja</strong> el método de pago <strong>"{initialValues?.name}"</strong>?</p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}> 
              <Info size={14} className="text-muted" style={{ marginBottom: "0.15rem", marginRight: "0.25rem"}} /> 
              No se podrá asignar este método de pago a nuevos cobros, pero los que ya lo tengan asignado no se verán afectados.
            </p>
          </div>
        ) : (
          <Input
            name="name"
            label="Nombre del Método de Pago"
            control={control}
            errors={errors}
            type="text"
            rules={{
              required: "El nombre del método de pago es requerido.",
              minLength: {
                value: 3,
                message: "El nombre del método de pago debe tener al menos 3 caracteres."
              },
              pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                message: "El nombre del método de pago solo puede contener letras, números, espacios y los símbolos: - ( ) ."
              }
            }}
          />
        )
      )}
    </Form>
  );
}
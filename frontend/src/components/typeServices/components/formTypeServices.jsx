import { Info } from "lucide-react";
import { Input, Form } from "../..";

import '../typeServices.css';

/**
 * Componente de formulario para tipos de servicio
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
 * @returns {JSX.Element} Formulario para tipos de servicio
 */
export const FormTypeService = ({ idModal, formId, onSubmit, loading, error, success, successMessage, initialValues = undefined, mode = undefined }) => {
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
      {({ control, errors }) =>
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer <strong>dar de baja</strong> el tipo de servicio <strong>"{initialValues?.name}"</strong>?</p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}> 
              <Info size={14} className="text-muted" style={{ marginBottom: "0.15rem", marginRight: "0.25rem"}} /> 
              No se podrá asignar este tipo de servicio a nuevos cobros, pero los que ya lo tengan asignado no se verán afectados.
            </p>
          </div>
        ) : (
          <>
            <Input
              name="name"
              label="Nombre del tipo de servicio"
              control={control}
              errors={errors}
              type="text"
              rules={{
                required: "El nombre del tipo de servicio es requerido.",
                minLength: {
                  value: 5,
                  message: "El nombre del tipo de servicio debe tener al menos 5 caracteres."
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                  message: "El nombre solo puede contener letras, números, espacios y los símbolos: - ( ) ."
                }
              }}
            />

            <Input
              name="description"
              label="Descripción del tipo de servicio"
              control={control}
              errors={errors}
              type="textarea"
              rules={{
                minLength: {
                  value: 5,
                  message: "La descripción debe tener al menos 5 caracteres.",
                },
                maxLength: {
                  value: 255,
                  message: "La descripción no puede exceder 255 caracteres.",
                },
              }}
            />

            <Input
              name="price"
              label="Monto del servicio"
              control={control}
              errors={errors}
              type="number"
              rules={{
                required: "El monto es requerido.",
                min: {
                  value: 0,
                  message: "El monto debe ser un número positivo.",
                },
              }}
              suffix="$"
            />
          </>
        )
      }
    </Form>
  );
};
import { Info } from "lucide-react";
import { Input, Form } from "../../";

import '../obraSocial.css';

/**
 * Componente de formulario para obras sociales
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
 * @returns {JSX.Element} Formulario para obras sociales
 */
export const FormObraSocial = ({ idModal, formId, onSubmit, loading, error, success, successMessage, initialValues = undefined, mode = undefined }) => {
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
      className="ObraSocialForm"
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer <strong>dar de baja</strong> la obra social <strong>"{initialValues?.name}"</strong>?</p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}> 
              <Info size={14} className="text-muted" style={{ marginBottom: "0.15rem", marginRight: "0.25rem"}} /> 
              No se podrá asignar esta obra social a nuevos pacientes, pero los que ya lo tengan asignado no se verán afectados.
            </p>
          </div>
        ) : (
          <Input
            name="name"
            label="Nombre de la Obra Social"
            control={control}
            errors={errors}
            type="text"
            rules={{
              required: "El nombre de la obra social es requerido.",
              minLength: {
                value: 3,
                message: "El nombre de la obra social debe tener al menos 3 caracteres."
              },
              pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-().]+$/,
                message: "El nombre de la obra social solo puede contener letras, números, espacios y los símbolos: - ( ) ."
              }
            }}
          />
        )
      )}
    </Form>
  );
}
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import './form.css';
import { Loading } from '../';
import { useBootstrapModalHidden, useTimedVisibility } from '../../hooks';
import { MessageSuccess } from '../ui/success/MessageSuccess';
import { MessageError } from '../ui/error/MessageError';

/**
 * Componente de formulario reutilizable que maneja estados de carga, error y éxito
 * @param {Object} props - Propiedades del componente
 * @param {string} props.idModal - ID del modal que contiene el formulario
 * @param {string} props.formId - ID único del formulario
 * @param {Function} props.onSubmit - Función que se ejecuta al enviar el formulario
 * @param {boolean} [props.loading=false] - Estado de carga del formulario
 * @param {Error|null} [props.error=null] - Error ocurrido durante el envío
 * @param {boolean} [props.success=false] - Indica si el envío fue exitoso
 * @param {string} [props.successMessage=""] - Mensaje a mostrar en caso de éxito
 * @param {boolean} [props.showSuccessInline=true] - Controla si se muestra el mensaje de éxito dentro del formulario
 * @param {Function} props.children - Función que renderiza los campos del formulario
 * @param {string} [props.className=""] - Clase CSS para el formulario
 * @returns {JSX.Element} Formulario con manejo de estados
 */
export const Form = ({ 
  idModal, 
  formId, 
  onSubmit, 
  loading = false, 
  error = null, 
  errorMessage = null,
  successMessage = null, 
  children, 
  initialValues = undefined, 
  className = "",
}) => {

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm({ mode: "onSubmit", defaultValues: initialValues });

  // Manejar la visibilidad del error (es decir, cuanto dura su visibilidad).
  const { visible: errorVisible } = useTimedVisibility({ trigger: errorMessage || error, durationMs: 2250, showWhen: true });
  useEffect(() => setShowErrorMessage(errorVisible), [errorVisible]);

  // Manejar la visibilidad del éxito (es decir, cuanto dura su visibilidad). 
  const { visible: successVisible } = useTimedVisibility({ trigger: successMessage, durationMs: 2000, showWhen: true });
  useEffect(() => setShowSuccessMessage(successVisible), [successVisible]);

  // Actualiza los valores del formulario solamente cuando cambien los defaultValues (initialValues)
  // y el usuario aún no modificó ningún campo (isDirty = false).
  // De esta forma:
  // - Se aplican los initialValues cuando abrís la modal / cambiás el turno seleccionado.
  // - NO se pisan los valores que el usuario escribió al reintentar enviar el formulario.
  useEffect(() => {
    if (!initialValues) return;
    if (!isDirty) {
      reset(initialValues);
    }
  }, [initialValues, reset, isDirty]);

  // Resetea el formulario cuando se cierra el modal.
  useBootstrapModalHidden(idModal, () => {
    reset();
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
  });

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className={`form ${className ? className : ""}`}>
        {children({ control, errors, watch, setValue })}
      </form>

      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Loading className="loading-container-form" />
        </div>
      )}

      {showSuccessMessage && (
        <MessageSuccess message={successMessage} className="mt-3" />
      )}

      {showErrorMessage && (errorMessage || error) && (
        <MessageError message={errorMessage || error?.message} className="mt-3" />
      )}
    </>
  );
};
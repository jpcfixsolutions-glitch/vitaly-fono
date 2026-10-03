import { Form, Input, Select } from "../../form";

/**
 * Componente para crear el formulario de configuración de calendario
 * @param {*} idModal - ID del modal
 * @param {*} formId - ID del formulario
 * @param {*} onSubmit - Función para enviar el formulario
 * @param {*} loading - Estado de carga
 * @param {*} error - Estado de error
 * @param {*} success - Estado de éxito
 * @param {*} successMessage - Mensaje de éxito
 * @param {*} mode - Modo del formulario
 * @param {*} initialValues - Valores iniciales del formulario
 */
export const FormConfigurationTimetable = ({ idModal, formId, onSubmit, loading, error, success, successMessage, mode, initialValues }) => {

  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      success={success}
      successMessage={successMessage}
      mode={mode}
      initialValues={initialValues}
    >
      {({ control, errors }) => (
        mode === "delete" ? (
          <div>
            <p>¿Estás seguro de querer eliminar la configuración del día <strong>"{initialValues?.day} de {initialValues?.start_time} a {initialValues?.end_time} hs"</strong>?</p>
          </div>
        ) : (
          <>
            <Select
              name="day"
              label="Día"
              control={control}
              errors={errors}
              options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']}
            />
            <Input
              name="start_time"
              label="Horario desde"
              control={control}
              errors={errors}
              type="text"
              rules={{
                required: "El horario desde es requerido.",
                minLength: {
                  value: 5,
                  message: "El horario desde debe ser en formato HH:MM."
                },
                maxLength: {
                  value: 5,
                  message: "El horario desde debe ser en formato HH:MM."
                }
              }}
              placeholder="Ej.: 08:00"
            />
            <Input
              name="end_time"
              label="Horario hasta"
              control={control}
              errors={errors}
              type="text"
              rules={{
                required: "El horario hasta es requerido.",
                minLength: {
                  value: 5,
                  message: "El horario hasta debe ser en formato HH:MM."
                },
                maxLength: {
                  value: 5,
                  message: "El horario hasta debe ser en formato HH:MM."
                }
              }}
              placeholder="Ej.: 17:00"
            />
            <span style={{ color: 'var(--gray-400)', display: 'block', fontSize: '0.8rem' }}>* Los horarios son en formato de 24 hs. Preferentemente usar 1 hora como duración.</span>
          </>
        )
      )}
    </Form>
  );
}
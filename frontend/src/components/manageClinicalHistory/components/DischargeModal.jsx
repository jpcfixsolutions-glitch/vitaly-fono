import React from 'react';
import { ModalPost, Form, Input } from '../..';
import { Select } from '../../form/components/select';
import { Calendar, Clock } from 'lucide-react';

export const DischargeModal = ({ onSave, loading = false, error = null, errorMessage = "", success = false, successMessage = "" }) => {
  const formId = 'dischargeForm';

  const now = new Date();

  const handleSubmit = (data) => {
    const payload = {
      type: data?.tipo_finalizacion,
      closing_reason: data?.razon_cierre?.trim() || '',
    };
    if (!payload.closing_reason) return; // validación básica; el Form también valida
    onSave(payload);
  };

  return (
    <ModalPost
      id="dischargeModal"
      title="Finalizar tratamiento"
      formId={formId}
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      success={success}
      successMessage={successMessage}
    >
      <Form
        idModal="dischargeModal"
        formId={formId}
        onSubmit={handleSubmit}
        loading={loading}
        // No pasamos `error` aquí para evitar duplicar mensajes:
        // el mensaje de error se muestra solo en el contenedor `ModalPost`.
        error={null}
        success={success}
        showSuccessInline={false}
        initialValues={{ tipo_finalizacion: 'Cierre de tratamiento', razon_cierre: '' }}
      >
        {({ control, errors }) => (
          <>
            <div className="timeline-item-meta" style={{ marginBottom: '1rem', backgroundColor: 'var(--gray-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <div className="timeline-item-meta-item date">
                <Calendar />
                <span>
                  {now.toLocaleDateString()}
                </span>
              </div>
              <div className="timeline-item-meta-item time">
                <Clock />
                <span>
                  {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <Select
              name="tipo_finalizacion"
              label="Tipo de finalización"
              control={control}
              errors={errors}
              options={["Cierre de tratamiento", "Interrupción de tratamiento"]}
              rules={{ required: "Seleccione el tipo de finalización." }}
              placeholder="Selecciona una opción"
              formId={formId}
            />

            <Input
              name="razon_cierre"
              label="Motivo / Razón de cierre"
              control={control}
              errors={errors}
              type="textarea"
              rules={{ required: "El motivo es obligatorio." }}
              placeholder="Describa el motivo de la finalización..."
              formId={formId}
            />
          </>
        )}
      </Form>
    </ModalPost>
  );
};

export default DischargeModal;
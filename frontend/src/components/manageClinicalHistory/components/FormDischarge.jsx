import React from 'react';
import { Form, Input } from '../../form';
import { Select } from '../../form/components/select';
import { Calendar, Clock } from 'lucide-react';
import { extractDate, extractTime } from '../../../utils';

export const FormDischarge = ({
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  initialValues = null,
}) => {
  // Ajustar fecha a local para visualización correcta (evitar desfase UTC)
  const getLocalDateSrc = (isoDate) => {
    const date = isoDate ? new Date(isoDate) : new Date();
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString();
  };

  const dateSrc = getLocalDateSrc(initialValues?.date);

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
        <>
        <div className="row g-3">
          <div className="col-12 mb-2">
            <div className="form-group">
              <label className="mb-2">Fecha y hora de finalización</label>
              <div className="d-flex align-items-center gap-3 p-2 bg-light rounded border">
                 <div className="d-flex align-items-center gap-2">
                   <Calendar size={18} style={{ color: '#Eab308' }} />
                   <span className="fw-medium text-dark">{extractDate(dateSrc)}</span>
                 </div>
                 <div style={{ width: '1px', height: '16px', backgroundColor: '#e5e7eb' }}></div>
                 <div className="d-flex align-items-center gap-2">
                   <Clock size={18} className="text-muted" />
                   <span className="fw-medium font-weight-bold text-dark">{extractTime(dateSrc)} hs</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="col-12 mt-0">
            <Select
              name="type"
              label="Tipo de finalización"
              control={control}
              errors={errors}
              options={["Cierre de tratamiento", "Interrupción de tratamiento"]}
              rules={{ required: "Seleccione el tipo de finalización" }}
              placeholder="Seleccione una opción..."
              formId={formId}
            />
          </div>

          <div className="col-12 mt-0">
            <Input
              name="closing_reason"
              label="Observaciones del cierre"
              type="textarea"
              control={control}
              errors={errors}
              placeholder="Escriba aquí las razones del cierre o abandono..."
              rules={{ required: 'El motivo es obligatorio' }}
              formId={formId}
              rows={5}
            />
          </div>
        </div>
        <div className="col-12 mt-0">
          <span className='text-muted' style={{ fontSize: '0.85rem' }}>* Nota: Finalizar el tratamiento implica eliminar turnos y sesiones programadas posteriores a la fecha de finalización.</span>
        </div>
      </>
    )}

    </Form>
  );
};

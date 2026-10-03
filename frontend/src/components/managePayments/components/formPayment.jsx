import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Form, Input, Select } from "../../";
import { handleSessionChange } from "../handlers/handleSessionChange";
import { handleServiceChange } from "../handlers/handleServiceChange";
import { formatDateDisplay, formatTimeDisplay } from "../../managePatients/utils/format";

export const FormPayment = ({
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  sessionOptions = [],
  healthInsuranceOptions = [],
  paymentMethodOptions = [],
  serviceOptions = [],
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
    >
      {({ control, errors, setValue }) => (
        mode === "delete" ? (
          <div>
            <p>
              ¿Estás seguro de querer <strong>anular</strong> el cobro de la sesión de{" "}
              <strong>"{initialValues?.name} {initialValues?.last_name}"</strong>?
            </p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
              Fecha de la sesión: {formatDateDisplay(initialValues?.all?.session_date, 'DD/MM/YYYY') + ' a las ' + formatTimeDisplay(initialValues?.all?.session_date) + ' hs.'|| '—'}
            </p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
              Fecha del cobro: {initialValues?.paid_at?.split(' ')[0] + ' a las ' + initialValues?.paid_at?.split(' ')[1] + ' hs.' || '—'}
            </p>
          </div>
        ) : (
          <>
            <Select
              name="id_session"
              label="Sesión *"
              control={control}
              errors={errors}
              options={sessionOptions}
              valueKey="value"
              labelKey="label"
              placeholder="Seleccione una sesión"
              disabled={loading}
              formId={formId}
              rules={{ required: "La sesión es requerida." }}
              onValueChange={handleSessionChange(sessionOptions, healthInsuranceOptions, setValue)}
            />

            <Controller
              name="id_patient"
              control={control}
              formId={formId}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <Input
              name="first_name"
              label="Nombre del Paciente *"
              control={control}
              errors={errors}
              type="text"
              disabled={true}
              formId={formId}
              rules={{ required: "El nombre del paciente es requerido." }}
            />

            <Input
              name="last_name"
              label="Apellido del Paciente *"
              control={control}
              errors={errors}
              type="text"
              disabled={true}
              formId={formId}
              rules={{ required: "El apellido del paciente es requerido." }}
            />

            <div className="form-row">
              <Input
                name="date"
                label="Fecha de la Sesión *"
                control={control}
                errors={errors}
                type="text"
                disabled
                formId={formId}
                rules={{ required: "La fecha de la sesión es requerida." }}
              />
              <Input
                name="time"
                label="Hora *"
                control={control}
                errors={errors}
                type="text"
                disabled
                formId={formId}
                rules={{ required: "La hora es requerida." }}
              />
            </div>

            <Select
              name="id_health_insurance"
              label="Obra Social del Paciente *"
              control={control}
              errors={errors}
              options={healthInsuranceOptions}
              valueKey="value"
              labelKey="label"
              placeholder="Selecciona la obra social"
              disabled={loading}
              formId={formId}
              rules={{ required: "La obra social es requerida." }}
            />

            <Select
              name="id_payment_method"
              label="Método de pago para abonar el cobro *"
              control={control}
              errors={errors}
              options={paymentMethodOptions}
              valueKey="value"
              labelKey="label"
              placeholder="Selecciona el método de pago"
              disabled={loading}
              formId={formId}
              rules={{ required: "El método de pago es requerido." }}
            />

            <Select
              name="id_service"
              label="Servicio brindado *"
              control={control}
              errors={errors}
              options={serviceOptions}
              valueKey="value"
              labelKey="label"
              placeholder="Selecciona el servicio"
              disabled={loading}
              formId={formId}
              rules={{ required: "El servicio es requerido." }}
              onValueChange={handleServiceChange(serviceOptions, setValue)}
            />

            <Input
              name="amount"
              label="Monto"
              control={control}
              errors={errors}
              type="number"
              disabled
              formId={formId}
              suffix="$"
            />

            <Input
              name="notes"
              label="Notas"
              control={control}
              errors={errors}
              type="textarea"
              formId={formId}
              placeholder="Notas adicionales del cobro (opcional)"
            />
          </>
        )
      )}
    </Form>
  );
};
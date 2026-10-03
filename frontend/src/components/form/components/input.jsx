import { Controller } from "react-hook-form";

/**
 * Componente de entrada de formulario que soporta diferentes tipos de inputs
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre/identificador del campo
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {string|React.ReactNode} props.label - Etiqueta que se muestra sobre el campo
 * @param {string} props.type - Tipo de input (text, textarea, checkbox, number)
 * @param {Object} [props.error=null] - Error específico del campo
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {Object} props.rules - Reglas de validación para el campo
 * @returns {JSX.Element} Componente de input con su etiqueta y manejo de errores
 */
export const Input = ({ name, control, label, type, error = null, errors, rules, placeholder = "", formId, disabled = false, suffix }) => {
  const inputId = formId ? `${formId}_${name}` : name;

  // Si el label es un string que contiene "*", envolver el asterisco en un span
  // para poder aplicarle estilos (rojo) de forma consistente en toda la app.
  let labelContent = label;
  if (typeof label === "string" && label.includes("*")) {
    const parts = label.split("*");
    labelContent = (
      <>
        {parts[0]}
        <span className="required-asterisk">*</span>
        {parts.slice(1).join("*")}
      </>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{labelContent}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          let controlEl = null;

          if (type === "textarea") {
            controlEl = (
              <textarea
                id={inputId}
                {...field}
                className={`form-control form-control-textarea ${error ? "is-invalid" : ""}`}
                value={field.value ? String(field.value) : ""}
                placeholder={placeholder}
                disabled={disabled}
              />
            );
          } else if (type === "checkbox") {
            controlEl = (
              <input
                id={inputId}
                type="checkbox"
                {...field}
                className={`form-check-input ${error ? "is-invalid" : ""}`}
                checked={!!field.value}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
              />
            );
          } else if (type === "datetime-local") {
            controlEl = (
              <input
                id={inputId}
                type="datetime-local"
                {...field}
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={field.value ? String(field.value) : ""}
                placeholder={placeholder}
                disabled={disabled}
              />
            );
          } else if (type === "number") {
            controlEl = (
              <input
                id={inputId}
                type="number"
                {...field}
                value={field.value === undefined || field.value === null ? "" : String(field.value)}
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
              />
            );
          } else {
            controlEl = (
              <input
                id={inputId}
                type={type || "text"}
                {...field}
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={field.value ? String(field.value) : ""}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
              />
            );
          }

          return suffix ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="input-suffix" style={{ color: "var(--gray-500)" }}>{suffix}</span>
              {controlEl}
            </div>
          ) : controlEl;
        }}
      />
      {errors[name] && <span>{errors[name]?.message?.toString()}</span>}
    </div>
  );

}
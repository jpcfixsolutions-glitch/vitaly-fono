import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

/**
 * Componente de select de formulario genérico
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre/identificador del campo
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {string|React.ReactNode} props.label - Etiqueta que se muestra sobre el campo
 * @param {Array} [props.options=[]] - Array de opciones estáticas del select
 * @param {Function} [props.loadOptions] - Función para cargar opciones dinámicamente
 * @param {string} [props.valueKey='id'] - Clave del objeto para el valor de la opción
 * @param {string} [props.labelKey='name'] - Clave del objeto para el texto de la opción
 * @param {string} [props.placeholder='Selecciona una opción'] - Texto del placeholder
 * @param {boolean} [props.disabled=false] - Si el select está deshabilitado
 * @param {Object} [props.error=null] - Error específico del campo
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {Object} props.rules - Reglas de validación para el campo
 * @returns {JSX.Element} Componente de select con su etiqueta y manejo de errores
 */
export const Select = ({
  name,
  control,
  label,
  options = [],
  loadOptions,
  valueKey = 'id',
  labelKey = 'name',
  placeholder = 'Selecciona una opción',
  disabled = false,
  error = null,
  errors,
  rules,
  formId,
  onValueChange
}) => {
  const selectId = formId ? `${formId}_${name}` : name;
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Si el label es un string con "*", envolver el asterisco en un span
  // para poder aplicar estilos globales (rojo) a todos los campos requeridos.
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

  useEffect(() => {
    if (loadOptions && typeof loadOptions === 'function') {
      setLoading(true);
      const loadData = async () => {
        try {
          const data = await loadOptions();
          setDynamicOptions(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error cargando opciones:', error);
          setDynamicOptions([]);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [loadOptions]);

  // Usar opciones dinámicas si están disponibles, sino usar opciones estáticas
  const finalOptions = loadOptions ? dynamicOptions : options;

  return (
    <div className="form-group">
      <label htmlFor={selectId}>{labelContent}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <select
            id={selectId}
            {...field}
            className={`form-select ${error ? "is-invalid" : ""}`}
            disabled={disabled || loading}
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e);
              if (onValueChange) onValueChange(e.target.value);
            }}
          >
            <option value="" disabled>
              {loading ? 'Cargando...' : placeholder}
            </option>
            {finalOptions?.map((option, index) => {
              // Manejar diferentes tipos de opciones
              if (typeof option === 'string' || typeof option === 'number') {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              }

              // Manejar objetos con valueKey y labelKey
              const value = option[valueKey];
              const label = option[labelKey];

              return (
                <option key={value || index} value={value}>
                  {label || value}
                </option>
              );
            })}
          </select>
        )}
      />
      {errors[name] && <span>{errors[name]?.message?.toString()}</span>}
    </div>
  );
};

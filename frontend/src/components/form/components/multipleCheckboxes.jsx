import { Controller } from "react-hook-form";

/**
 * Componente para múltiples checkboxes independientes
 * Ideal para seleccionar varios elementos de una lista (p.ej. privilegios)
 * Los valores iniciales se manejan a través de initialValues del componente Form
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del campo en el formulario
 * @param {Object} props.control - Control de react-hook-form
 * @param {string} props.label - Etiqueta del grupo de checkboxes
 * @param {Array} props.options - Array de opciones { id, name, description }
 * @param {Object} props.errors - Errores del formulario
 * @param {Object} props.rules - Reglas de validación
 */
export const MultipleCheckboxes = ({
  name,
  control,
  label,
  options = [],
  errors,
  rules = {},
}) => {
  return (
    <div className="form-group multiple-checkboxes">
      {label && <label>{label}</label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          // Asegurar que field.value sea un array
          const currentValue = Array.isArray(field.value) ? field.value : [];

          return (
            <div className="checkboxes-container">
              {options.map((option) => {
                // Verificar si el ID está en el array de valores
                const isChecked = currentValue.includes(option.id);
                return (
                  <label key={option.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Agregar el ID si no está ya en el array
                          if (!currentValue.includes(option.id)) {
                            field.onChange([...currentValue, option.id]);
                          }
                        } else {
                          // Remover el ID del array
                          field.onChange(currentValue.filter((id) => id !== option.id));
                        }
                      }}
                    />
                    <span className="checkbox-text">
                      {option.name}
                      {option.description && (
                        <span className="checkbox-description"> - {option.description}</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
      {errors?.[name] && <span>{errors?.[name]?.message?.toString()}</span>}
    </div>
  );
};


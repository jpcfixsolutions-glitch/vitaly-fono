import { Controller } from "react-hook-form";

/**
 * Dibuja dos checkboxes mutuamente excluyentes para un mismo campo string
 * Ideal para toggles binarios representados por texto (p.ej. modalidad)
 */
export const ChoiceCheckboxes = ({
  name,
  control,
  label,
  options = [
    { value: "Presencial", label: "Presencial" },
    { value: "Virtual", label: "Virtual" },
  ],
  errors,
  rules = {},
  defaultValue,
}) => {
  return (
    <div className="form-group choice-checkboxes">
      {label && (
        <label>
          {label} {rules?.required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue ?? options?.[0]?.value}
        render={({ field }) => (
          <div>
            {options.map((opt) => {
              const checked = field.value === opt.value || (!field.value && (defaultValue ?? options?.[0]?.value) === opt.value);
              return (
                <label key={opt.value} className="choice-item">
                  <input
                    type="checkbox"
                    className="choice-input"
                    checked={checked}
                    onChange={() => field.onChange(checked ? "" : opt.value)}
                  />
                  <span className="choice-text">{opt.label}</span>
                </label>
              );
            })}
          </div>
        )}
      />
      {errors?.[name] && <span>{errors?.[name]?.message?.toString()}</span>}
    </div>
  );
};



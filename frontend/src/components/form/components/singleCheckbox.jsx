import { Controller } from "react-hook-form";

export const SingleCheckbox = ({
  name,
  control,
  label,
  helper = "",
  errors,
}) => {
  return (
    <div className="form-group choice-checkboxes">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label className="choice-item">
            <input
              type="checkbox"
              className="choice-input"
              checked={!!field.value}
              onChange={() => field.onChange(!field.value)}
            />
            <span className="choice-text">{label}</span>
          </label>
        )}
      />
      {helper && <div className="choice-helper">{helper}</div>}
      {errors?.[name] && <span>{errors?.[name]?.message?.toString()}</span>}
    </div>
  );
};



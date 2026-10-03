export const FilterInputSelect = ({ filter, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(filter.id, e.target.value)}
      className="form-select filter-input"
    >
      {filter.options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};


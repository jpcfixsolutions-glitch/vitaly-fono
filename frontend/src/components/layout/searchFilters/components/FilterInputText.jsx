export const FilterInputText = ({ filter, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={filter.placeholder || `Buscar por ${filter.label.toLowerCase()}...`}
      value={value}
      onChange={(e) => onChange(filter.id, e.target.value)}
      className="filter-input"
      autoComplete="off"
    />
  );
};


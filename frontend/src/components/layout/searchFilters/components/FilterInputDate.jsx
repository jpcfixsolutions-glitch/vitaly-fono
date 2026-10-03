export const FilterInputDate = ({ filter, value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(filter.id, e.target.value)}
      className="filter-input"
    />
  );
};


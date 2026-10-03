export const handleClearFilters = (filters, setFilterValues) => () => {
  const clearedFilters = {};
  filters.forEach(filter => {
    clearedFilters[filter.id] = filter.defaultValue || '';
  });
  setFilterValues(clearedFilters);
};


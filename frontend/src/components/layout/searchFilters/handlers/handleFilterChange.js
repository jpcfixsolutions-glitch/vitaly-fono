export const handleFilterChange = (setFilterValues) => (filterId, value) => {
  setFilterValues(prev => ({
    ...prev,
    [filterId]: value
  }));
};


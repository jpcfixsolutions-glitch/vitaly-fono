import { useState, useEffect } from 'react';
import { handleFilterChange } from '../handlers/handleFilterChange';
import { handleClearFilters } from '../handlers/handleClearFilters';

export const useSearchFilters = (filters, onFilterChange) => {
  // Estado interno para los valores de los filtros
  const [filterValues, setFilterValues] = useState(() => {
    const initialState = {};
    filters.forEach(filter => {
      initialState[filter.id] = filter.defaultValue || '';
    });
    return initialState;
  });

  // Efecto para notificar cambios al padre
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filterValues);
    }
  }, [filterValues, onFilterChange]);

  const onFilterChangeHandler = handleFilterChange(setFilterValues);
  const onClearFiltersHandler = handleClearFilters(filters, setFilterValues);

  return {
    filterValues,
    handleFilterChange: onFilterChangeHandler,
    handleClearFilters: onClearFiltersHandler
  };
};


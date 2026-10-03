import { useState, useCallback } from 'react';

/**
 * Hook genérico para manejar el estado de filtros.
 * Puede ser utilizado por cualquier componente que requiera filtrado.
 * 
 * @param {Object} initialFilters - Estado inicial de los filtros.
 * @returns {Object} { filters, handleFilterChange, setFilters }
 */
export const useFilter = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  return {
    filters,
    handleFilterChange,
    setFilters
  };
};


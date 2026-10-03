import { useState, useMemo, useCallback } from 'react';
import { buildFilteredPatients } from '../utils/filtering';
import { calculateAge } from '../utils';

/**
 * Hook unificado para manejar la búsqueda y filtrado de pacientes.
 * Encapsula tanto el estado de los filtros como la lógica de filtrado de datos.
 *
 * @param {Object} dataPatient - Objeto de datos que contiene la lista de pacientes (dataPatient.data).
 * @returns {Object} { filters, filteredPatients, handleFilterChange }
 */
export const usePatientSearch = (dataPatient) => {
  // 1. Estado de los filtros (inicializado con valores por defecto)
  const [filters, setFilters] = useState({ fullName: '', status: '' });

  // 2. Handler para actualizar filtros (usa useCallback para evitar recreaciones innecesarias)
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 3. Lógica de filtrado (usa useMemo para recalcular solo cuando cambian datos o filtros)
  const filteredPatients = useMemo(() => {
    return buildFilteredPatients(dataPatient, filters, calculateAge);
  }, [dataPatient, filters]);

  return {
    filters,
    filteredPatients,
    handleFilterChange
  };
};


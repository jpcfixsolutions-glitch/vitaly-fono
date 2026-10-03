import { useEffect } from 'react';

/**
 * Hook que selecciona automáticamente un paciente cuando se navega desde otra página
 * (ej: desde Gestión de Pacientes). También ajusta el filtro de estado según el paciente encontrado.
 * 
 * Solo se ejecuta la primera vez si no hay un paciente ya seleccionado manualmente.
 * 
 * @param {Object} params - Parámetros del hook
 * @param {string|null} params.externalSelectedPatientId - ID del paciente que viene desde location.state
 * @param {Array} params.filteredPatients - Array de pacientes filtrados donde buscar
 * @param {Object|null} params.selectedPatient - Paciente actualmente seleccionado
 * @param {Function} params.setSelectedPatient - Función para establecer el paciente seleccionado
 * @param {Function} params.setStatusFilter - Función para establecer el filtro de estado
 * @param {Function} params.navigate - Función para navegar (limpiar estado)
 * @param {string} params.pathname - Ruta actual para reemplazar el estado
 */
export const useAutoSelectPatient = ({
  externalSelectedPatientId,
  filteredPatients,
  selectedPatient,
  setSelectedPatient,
  setStatusFilter,
  navigate,
  pathname
}) => {
  useEffect(() => {
    // Validaciones: si no hay ID externo, pacientes, o ya hay uno seleccionado, no hacer nada
    if (!externalSelectedPatientId || !Array.isArray(filteredPatients) || filteredPatients.length === 0) {
      return;
    }
    
    // Si ya hay un paciente seleccionado (por el usuario), no forzar otro
    if (selectedPatient) {
      return;
    }

    // Buscar el paciente en la lista filtrada
    const found = filteredPatients.find((p) => String(p.id) === String(externalSelectedPatientId));
    
    if (!found) {
      return;
    }

    // Seleccionar el paciente encontrado
    setSelectedPatient(found);

    // Ajustar filtro según el estado del paciente
    if (found.status === 'Inactivo' || found.status === false) {
      setStatusFilter('inactive');
    } else if (found.status === 'Activo' || found.status === true) {
      setStatusFilter('active');
    }

    // Limpiar el estado de la navegación para evitar reselección al recargar
    if (navigate && pathname) {
      navigate(pathname, { replace: true, state: {} });
    }
    
  }, [externalSelectedPatientId, filteredPatients, selectedPatient, setSelectedPatient, setStatusFilter, navigate, pathname]);
};

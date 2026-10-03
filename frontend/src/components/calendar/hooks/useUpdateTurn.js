import { useState, useEffect } from 'react';
import { useApi } from "../../../hooks";
import { closeModal } from '../../../utils';

/**
 * Hook personalizado para actualizar un turno en la API y manejar el cambio de estado.
 * @param {Object} selectedEvent - El evento seleccionado
 * @param {Function} setSelectedEvent - Función para actualizar el evento seleccionado
 * @returns {Object} 
 */
export const useUpdateTurn = (selectedEvent, setSelectedEvent) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const { trigger, loading, error } = useApi({
    id: selectedEvent?.id,
    url: "/turnos",
    method: "PATCH",
  });

  // Ocultar mensaje de error automáticamente tras 2250 ms
  useEffect(() => {
    if (!updateError) return;
    const timeoutId = setTimeout(() => setUpdateError(null), 2250);
    return () => clearTimeout(timeoutId);
  }, [updateError]);

  // Limpiar error al cerrarse la modal por cualquier vía
  useEffect(() => {
    const modalEl = document.getElementById('eventDetailModal');
    if (!modalEl) return;
    const reset = () => setUpdateError(null);
    modalEl.addEventListener('hide.bs.modal', reset);
    modalEl.addEventListener('hidden.bs.modal', reset);
    return () => {
      modalEl.removeEventListener('hide.bs.modal', reset);
      modalEl.removeEventListener('hidden.bs.modal', reset);
    };
  }, []);

  const updateTurn = async (data) => {
    if (!selectedEvent?.id) return;

    setUpdatingStatus(true);
    setUpdateError(null);
    try {
      const response = await trigger({ status: data });

      if (response?.status === 'success') {
        closeModal('eventDetailModal');
        setSelectedEvent(null);
        window.location.reload();
      } else {
        setUpdateError(response?.error || response?.message || 'Error al actualizar el estado del turno');
      }

      return response;
    } catch (error) {
      setUpdateError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return { 
    updateTurn, 
    loading, 
    error,
    updatingStatus,
    updateError,
    setUpdateError 
  };
};

import { useApi } from '../../../hooks';

/**
 * Hook personalizado para dar de baja un rol en la API.
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} deactivateRole - Función para dar de baja un rol
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useDeactivateRole = (dataDeactivateRole) => {
  const { trigger, loading, error } = useApi({
    id: dataDeactivateRole?.id,
    url: "/rol",
    method: "DELETE",
  });

  const deactivateRole = async () => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.error("Error al dar de baja el rol:", error);
      throw error;
    }
  };

  return { deactivateRole, loading, error };
};

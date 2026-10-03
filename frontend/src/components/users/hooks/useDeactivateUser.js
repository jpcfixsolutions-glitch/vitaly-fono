import { useApi } from '../../../hooks';

/**
 * Hook personalizado para dar de baja un usuario en la API.
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} deactivateUser - Función para dar de baja un usuario
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useDeactivateUser = (dataDeactivateUser) => {
  const { trigger, loading, error } = useApi({
    id: dataDeactivateUser?.id,
    url: "/usuarios",
    method: "DELETE",
  });

  const deactivateUser = async () => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.error("Error al dar de baja el usuario:", error);
      throw error;
    }
  };

  return { deactivateUser, loading, error };
};
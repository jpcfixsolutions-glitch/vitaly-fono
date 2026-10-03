import { useApi } from "./useApi";

/**
 * Hook personalizado para crear un nuevo registro
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} post - Función para crear un nuevo registro
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const usePost = ({ url, method }) => {
  const { trigger, loading, error } = useApi({
    url,
    method,
  });

  const post = async (formData) => {
    const response = await trigger(formData);
    return response;
  };

  return { post, loading, error };
};

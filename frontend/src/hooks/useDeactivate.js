import { useApi } from "./useApi";

/**
 * Hook personalizado para desactivar un registro
 * @param {Object} data - Objeto con el ID del registro
 * @param {string} url - URL base para la petición
 * @param {string} method - Método HTTP a utilizar (GET, POST, PUT, DELETE, etc)
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} deactivate - Función para desactivar un registro
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useDeactivate = ({ data, url, method }) => {
  const { trigger, loading, error } = useApi({
    id: data?.id,
    url,
    method,
  });

  const deactivate = async () => {
    if (!data?.id) {
      throw new Error("No se ha proporcionado un ID válido para desactivar el registro");
    }

    const response = await trigger();
    return response;
  };

  return { deactivate, loading, error };
};

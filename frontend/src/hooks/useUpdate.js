// ToDo: ya revisado, se puede borrar. falta controlar que historias clinicas no lo use.

import { useApi } from "./useApi";

/**
 * Hook personalizado para actualizar un registro
 * @param {Object} data - Objeto con el ID del registro
 * @param {string} url - URL base para la petición
 * @param {string} method - Método HTTP a utilizar (GET, POST, PUT, DELETE, etc)
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} update - Función para actualizar un registro
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useUpdate = ({ data, url, method }) => {
  const { trigger, loading, error } = useApi({
    id: data?.id,
    url,
    method,
    autoFetch: false
  });

  const update = async (...args) => {
    let dynamicId = null;
    let formData = null;

    if (args.length === 2) {
      dynamicId = args[0];
      formData = args[1];
    } else {
      formData = args[0];
    }

    if (!dynamicId && !data?.id) {
      throw new Error("No se ha proporcionado un ID válido para actualizar el registro");
    }

    const response = await trigger(formData, dynamicId || undefined);
    return response;
  };

  return { update, loading, error };
};
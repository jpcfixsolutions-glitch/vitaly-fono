import { useEffect, useState } from "react";
import { useApi } from ".";
import { filterByStatus, orderByName } from "../utils";

/**
 * Hook personalizado para obtener la lista de roles del sistema.
 *
 * @function
 * @name useGetAllRoles
 *
 * @param {boolean} [needFilterByStatus=false] - Si es true, filtra los roles para incluir sólo los activos usando la función `filterByStatus`.
 *
 * @returns {Object} Retorna un objeto con las siguientes propiedades:
 *   @property {Object} roles - Un objeto con todos los roles obtenidos, envuelto en una propiedad `data`.
 *     Por ejemplo: `{ data: [ ...roles ] }`. Si no hay datos, será un array vacío.
 *   @property {boolean} loading - Indica si la petición de datos está en curso.
 *   @property {any} error - Contiene el error si ocurrió alguno al obtener los roles.
 *   @property {Function} refetch - Función que permite volver a obtener los roles manuamente.
 *
 * @description
 * Este hook realiza una petición GET a "/rol" usando `useApi`. 
 * Puede filtrar por estado activo si así se indica, y ordena los roles alfabéticamente por nombre.
 * Actualiza internamente los estados de carga (`loading`) y errores (`error`).
 */
export const useGetAllRoles = (needFilterByStatus = false) => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error, loading, trigger } = useApi({
    url: "/rol",
    method: "GET",
    autoFetch: true,
  });

  /**
   * Refresca manualmente los roles desde la API.
   * Reinicia el estado de carga y error antes de relanzar la consulta.
   */
  const refetch = async () => {
    setIsLoading(true);
    setFinalError(null);
    await trigger();
  };

  useEffect(() => {
    if (loading) return;

    if (data && data.status === "success") {
      const items = Array.isArray(data?.data) ? data.data : [];
      let processedData = items;

      if (needFilterByStatus) {
        processedData = filterByStatus(processedData);
      }
      processedData = orderByName(processedData);

      setRoles({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (error && !loading && !data?.message?.includes?.("undefined")) {
      setRoles([]);
      setFinalError(error);
      setIsLoading(false);
      return;
    }
  }, [data, error, loading]);

  return { roles, loading: isLoading, error: finalError, refetch };
};

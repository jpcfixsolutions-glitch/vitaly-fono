import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { filterByUser, filterByStatusTurn, orderByName } from "../utils";

/**
 * useGetAllTurns
 *
 * Custom hook para obtener, filtrar y ordenar la lista de turnos (agenda). Este hook abstrae la lógica de fetching de turnos desde una API,
 * así como el procesamiento posterior que incluye filtrado por usuario, filtrado por estado y ordenamiento por nombre.
 *
 * Características:
 * - Utiliza el hook personalizado `useApi` para ejecutar la solicitud HTTP, recibiendo los parámetros `url`, `method` y `autoFetch`.
 * - Aplica secuencialmente las funciones utilitarias `filterByUser`, `filterByStatusTurn` y `orderByName` sobre el array de turnos recibido,
 *   asegurando que el array final cumpla con los criterios de visibilidad y orden requeridos.
 * - Expone el estado del array de turnos procesados, indicador de carga, error de la petición (si hubiera) y una función para refetch manual.
 *
 * @param {Object} params - Parámetros de configuración del hook.
 * @param {string} params.url - Endpoint de la API de donde obtener los turnos.
 * @param {string} params.method - Método HTTP a utilizar (comúnmente "GET").
 * @param {boolean} [params.autoFetch=false] - Indica si la fetch se debe disparar automáticamente al montar el componente.
 *
 * @returns {Object} Hook state.
 * @returns {Object} returns.turns - Objeto con la propiedad `data` que contiene el array de turnos procesados.
 * @returns {boolean} returns.loading - Estado de carga de la solicitud de turnos.
 * @returns {any} returns.error - Error producido durante la obtención de los turnos, en caso de que ocurra.
 * @returns {Function} returns.refetch - Función para volver a disparar manualmente la fetch de datos.
 *
 * Ejemplo de uso:
 * const { turns, loading, error, refetch } = useGetAllTurns({ url: "/turnos", method: "GET", autoFetch: true });
 */
export const useGetAllTurns = ({ url, method, autoFetch = false }) => {
  const [turns, setTurns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error: apiError, loading: apiLoading, trigger } = useApi({
    url,
    method,
    autoFetch
  });

  /**
   * Refresca manualmente la obtención de turnos desde la API. Restablece los estados de carga y error antes de disparar la fetch.
   */
  const refetch = async () => {
    setIsLoading(true);
    setFinalError(null);
    await trigger();
  };

  useEffect(() => {
    if (apiLoading) {
      return;
    }

    // Cuando la respuesta de la API es exitosa, aplica los filtros y sorting necesarios.
    if (data && data.status === 'success') {
      const items = Array.isArray(data.data) ? data.data : [];
      let processedData = items;
      
      processedData = filterByUser(processedData);

      processedData = filterByStatusTurn(processedData);

      processedData = orderByName(processedData);

      setTurns({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    // Si hay un error en la API y la data no es exitosa, establece el error final.
    if (apiError && !apiLoading && !data.message.includes('undefined')) {
      setTurns([]);
      setFinalError(apiError);
      setIsLoading(false);
      return;
    }

    // Si autoFetch es falso, asegúrate de que el loading se apague cuando termina la primera renderización.
    if (!autoFetch) {
      setIsLoading(false);
    }

  }, [data, apiError, apiLoading, autoFetch]);

  return { turns, loading: isLoading, error: finalError, refetch };
};
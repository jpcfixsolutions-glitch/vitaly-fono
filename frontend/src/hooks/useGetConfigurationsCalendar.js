import { useEffect, useState } from "react";
import { useApi } from ".";
import { filterByUser, orderByName } from "../utils";
import { orderByDayAndStartTime } from "../components/configureTimetable/utils";

/**
 * useGetConfigurationsCalendar
 *
 * Custom hook para obtener, filtrar y ordenar la lista de configuraciones de calendario.
 * Este hook gestiona el estado y el fetching de configuraciones desde la API correspondiente,
 * aplicando procesamientos adicionales como filtrado por usuario,
 * ordenamiento cronológico por día y hora de inicio, y ordenamiento alfabético por nombre.
 *
 * Características:
 * - Utiliza el hook personalizado `useApi` para disparar la solicitud HTTP con los parámetros `url`, `method` y `autoFetch`.
 * - Aplica las funciones `filterByUser`, `orderByDayAndStartTime` y `orderByName` para procesar el array de configuraciones recibido.
 * - Expone el estado procesado de configuraciones, el indicador de carga, cualquier error detectado y un método de refetch manual.
 *
 * @param {Object} params - Parámetros de configuración del hook.
 * @param {string} params.url - Endpoint de la API que provee las configuraciones del calendario.
 * @param {string} params.method - Método HTTP a utilizar (habitualmente 'GET').
 * @param {boolean} [params.autoFetch=false] - Si se debe realizar fetch automáticamente al montar el componente.
 *
 * @returns {Object} Hook state.
 * @returns {Object} returns.configurations - Objeto con la propiedad `data`, que contiene el array procesado de configuraciones.
 * @returns {boolean} returns.loading - Estado de carga de la solicitud de configuraciones.
 * @returns {any} returns.error - Error de la obtención de configuraciones, en caso de ocurrir.
 * @returns {Function} returns.refetch - Función para disparar manualmente el re-fetch de las configuraciones.
 *
 * Ejemplo de uso:
 * const { configurations, loading, error, refetch } = useGetConfigurationsCalendar({
 *   url: "/configuraciones-calendario",
 *   method: "GET",
 *   autoFetch: true
 * });
 */
export const useGetConfigurationsCalendar = ({ url, method, autoFetch = false }) => {
  const [configurations, setConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error: apiError, loading: apiLoading, trigger } = useApi({
    url,
    method,
    autoFetch
  });

  /**
   * Re-dispara la obtención de configuraciones desde la API.
   * Reinicia los estados de carga y error.
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

    // Si el fetch es exitoso, procesa y guarda los datos obtenidos de la API
    if (data && data.status === 'success') {
      const items = Array.isArray(data.data) ? data.data : [];
      let processedData = items;

      // Filtra las configuraciones que correspondan al usuario actual, si es relevante
      processedData = filterByUser(processedData);

      // Ordena primero por día y hora de inicio para priorizar la visualización lógica en la agenda
      processedData = orderByDayAndStartTime(processedData);

      // Finalmente, ordena alfabéticamente por nombre (útil para listados legibles)
      processedData = orderByName(processedData);

      setConfigurations({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    // Si ocurre un error en la petición (distinto de error de datos indefinidos)
    if (apiError && !apiLoading && !data.message.includes('undefined')) {
      setConfigurations({ data: [] });
      setFinalError(apiError);
      setIsLoading(false);
      return;
    }

    // Cuando no se debe auto-fetch, aseguramos no quedar colgado en loading
    if (!autoFetch) {
      setIsLoading(false);
    }

  }, [data, apiError, apiLoading, autoFetch]);

  return { configurations, loading: isLoading, error: finalError, refetch };
};
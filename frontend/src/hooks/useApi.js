import { useEffect, useRef, useState, useCallback } from "react"
import apiClient from "../services/apiClient"
import axios from "axios";

/**
 * Hook personalizado para realizar peticiones HTTP
 * @param {Object} params - Parámetros de configuración para la petición
 * @param {string} [params.id] - ID opcional para construir la URL con un identificador
 * @param {string} params.url - URL base para la petición
 * @param {string} params.method - Método HTTP a utilizar (GET, POST, PUT, DELETE, etc)
 * @param {Object} [params.headers] - Cabeceras HTTP adicionales
 * @param {boolean} [params.autoFetch=false] - Indica si se debe realizar la petición automáticamente (Solo sirve para peticiones GET)
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} trigger - Función para disparar la petición manualmente
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Object|null} data - Datos obtenidos de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useApi = ({ id, url, method, autoFetch = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Referencia al controlador de la petición, podemos cancelarla manualmente en caso de que sea necesario cuando el componente se desmonte.
  const controllerRef = useRef(null);

  const trigger = useCallback(async (body = null, dynamicId = null) => {
    if (!url) return;

    // Si existe una petición anterior, se cancela
    if (controllerRef.current) {
      controllerRef.current.abort();
    };

    // Se crea un nuevo controlador para esta petición
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    try {
      // Construye la URL relativa (apiClient ya tiene el baseURL)
      const urlId = dynamicId || id;
      // Quitamos la barra inicial si existe, porque apiClient ya la tiene
      const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
      // Permite pasar querystring completo en dynamicId (e.g., "?name=Juan")
      const finalUrl = urlId && typeof urlId === 'string' && urlId.startsWith('?')
        ? `${cleanUrl}${urlId}`
        : [cleanUrl, urlId].filter(Boolean).join('/');

      const response = await apiClient({
        url: finalUrl,
        method,
        data: body,
        signal: controller.signal,
      });

      const jsonData = await response.data;

      setData(jsonData);
      setLoading(false);
      setError(null);

      return jsonData;
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      const message = error.response?.data?.message || error.message || 'Error de consulta.';
      const httpStatus = error.response?.status ?? null;
      const errorData = {
        status: "error",
        message,
        data: [],
        httpStatus
      };

      const requestError = new Error(message);
      requestError.status = httpStatus;

      setLoading(false);
      setData(errorData);
      setError(requestError);
      return errorData;
    } finally {
      setLoading(false);
    }
  }, [url, id, method]);

  // Si se configura autoFetch, se realiza la petición automáticamente cuando el componente se monta
  useEffect(() => {
    if (autoFetch && method === "GET") {
      trigger();
    }
  }, [url, method, autoFetch]);

  // Cleanup: cancela la petición pendiente (si existe) cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, trigger };
}

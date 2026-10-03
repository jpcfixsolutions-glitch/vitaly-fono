import { Loading } from "../ui/loading";

/**
 * Procesa los datos para mostrar el mensaje de error, la carga o los datos de la tabla
 * @param {*} data - Datos de la tabla
 * @param {*} apiLoading - Estado de carga de la API
 * @param {*} apiError - Estado de error de la API
 * @param {*} message - Mensaje de error
 * @returns - Componente de carga, mensaje de error o datos de la tabla
 */
export const processData = (data, apiLoading, apiError, message = "") => {
  if (apiLoading && !apiError) {
    return <Loading className="table-container-loading" />
  }

  if (apiError && !apiLoading) {
    return <div>{apiError.message || 'Error al obtener los datos'}</div>;
  }

  if (data.length === 0 || data.data.length === 0) return <div>{message}</div>;
}
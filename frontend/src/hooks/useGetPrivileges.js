import { useEffect, useState } from "react";
import { useApi } from ".";

/**
 * Hook personalizado para obtener la lista de privilegios desde la API.
 *
 * @function
 * @name useGetPrivileges
 *
 * @returns {Object} Retorna un objeto con las siguientes propiedades:
 *   @property {Object} privileges - Un objeto con todos los privilegios obtenidos, envuelto en una propiedad `data`.
 *     Por ejemplo: `{ data: [ ...privilegios ] }`. Si no hay datos, será un array vacío.
 *   @property {boolean} loading - Indica si la petición de datos está en curso.
 *   @property {any} error - Contiene el error si ocurrió alguno al obtener los privilegios.
 *
 * @description
 * Este hook realiza una petición GET a "/privilegio" usando `useApi`.
 * Actualiza los estados internos correspondientes a los privilegios, la carga y los errores.
 * Puede ser usado para mostrar la lista de todos los privilegios disponibles en el sistema.
 */
export const useGetPrivileges = () => {
  const [privileges, setPrivileges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error, loading } = useApi({
    url: "/privilegio",
    method: "GET",
    autoFetch: true,
  });

  useEffect(() => {
    if (loading) return;

    if (data && data.status === "success") {
      setPrivileges({ data: data.data || [] });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (error && !loading) {
      setPrivileges([]);
      setFinalError(error);
      setIsLoading(false);
      return;
    }
  }, [data, error, loading]);

  return { privileges, loading: isLoading, error: finalError };
};

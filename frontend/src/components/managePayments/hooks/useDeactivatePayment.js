import { useApi } from "../../../hooks";

/**
 * Hook personalizado para desactivar un registro
 * @param {Object} dataDeactivatePaymentHistory - Objeto con el ID del registro
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} deactivatePaymentHistory - Función para desactivar un registro
 * @property {boolean} apiLoadingDeactivatePaymentHistory - Estado de carga de la petición
 * @property {Error|null} apiErrorDeactivatePaymentHistory - Error ocurrido durante la petición
 */
export const useDeactivatePayment = (dataDeactivatePaymentHistory) => {
  const { trigger, loading, error } = useApi({
    id: dataDeactivatePaymentHistory?.id,
    url: "/historial-cobro",
    method: "DELETE",
  });

  const deactivatePaymentHistory = async () => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.error("Error al desactivar el registro:", error);
      throw error;
    }
  };

  return { deactivatePaymentHistory, loading, error };
};
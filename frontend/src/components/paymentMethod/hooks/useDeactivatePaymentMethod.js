import { useApi } from '../../../hooks';

/**
 * Hook personalizado para dar de baja un método de pago en la API.
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} deactivatePaymentMethod - Función para dar de baja un método de pago
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useDeactivatePaymentMethod = (dataDeactivatePaymentMethod) => {
  const { trigger, loading, error } = useApi({
    id: dataDeactivatePaymentMethod?.id,
    url: "/metodo-pago",
    method: "DELETE",
  });

  const deactivatePaymentMethod = async () => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.error("Error al dar de baja el método de pago:", error);
      throw error;
    }
  };

  return { deactivatePaymentMethod, loading, error };
};
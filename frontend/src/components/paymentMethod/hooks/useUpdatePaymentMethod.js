import { useApi } from '../../../hooks';
import { getUser } from '../../../utils/getUser';

/**
 * Hook personalizado para actualizar un método de pago en la API.
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} updatePaymentMethod - Función para actualizar un método de pago
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useUpdatePaymentMethod = (dataUpdatePaymentMethod) => {
  const { trigger, loading, error } = useApi({
    id: dataUpdatePaymentMethod?.id,
    url: "/metodo-pago",
    method: "PATCH",
  });

  const updatePaymentMethod = async (formData) => {
    try {
      // Construir payload consistente con el backend
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        id_user: getUser().id || undefined,
      };
      
      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al actualizar el método de pago:", error);
      throw error;
    }
  };

  return { updatePaymentMethod, loading, error };
};
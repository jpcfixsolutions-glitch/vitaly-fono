import { useApi } from '../../../hooks';
import { getUser } from '../../../utils/getUser';

/**
 * Hook personalizado para crear un nuevo paciente en la API.
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} postPatient - Función para crear un nuevo paciente
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const usePostPaymentMethod = () => {
  const { trigger, loading, error } = useApi({
    url: '/metodo-pago',
    method: 'POST',
  });

  const postPaymentMethod = async (formData) => {
    try {
      // Construir payload consistente con el backend
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        id_user: getUser().id || undefined,
      };
      
      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al crear el método de pago:", error);
      throw error;
    }
  };

  return { postPaymentMethod, loading, error };
};
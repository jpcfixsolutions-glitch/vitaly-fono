import { useApi } from '.';
import { getUser } from '../utils/getUser';

/**
 * Hook personalizado para crear un nuevo paciente en la API.
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} postPatient - Función para crear un nuevo paciente
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const usePostPatient = () => {
  const { trigger, loading, error } = useApi({
    url: '/pacientes',
    method: 'POST',
  });

  const postPatient = async (formData) => {
    try {
      // Construir payload consistente con el backend
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        last_name: formData?.last_name ? String(formData.last_name).trim() : undefined,
        phone: formData?.phone ? String(formData.phone).trim() : undefined,
        document_number: formData?.document_number ? String(formData.document_number).trim() : undefined,
        id_document_type: formData?.id_document_type || undefined,
        birth_date: formData?.birth_date || undefined,
        email: formData?.email ? String(formData.email).trim() : undefined,
        address: formData?.address ? String(formData.address).trim() : undefined,
        id_health_insurance: formData?.id_health_insurance || undefined,
        id_user: formData?.id_user || getUser().id || undefined,
      };
      
      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al crear el paciente:", error);
      throw error;
    }
  };

  return { postPatient, loading, error };
};
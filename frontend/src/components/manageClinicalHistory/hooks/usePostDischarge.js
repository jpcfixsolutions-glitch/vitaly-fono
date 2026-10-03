import { useApi } from "../../../hooks";

export const usePostDischarge = () => {
  const { trigger, loading, error } = useApi({ url: '/cierre-tratamientos', method: 'POST' });

  const postDischarge = async (formData, id_patient) => {
    try {
      const payload = {
        id_patient,
        type: formData.type,
        closing_reason: formData.closing_reason,
      };
      const response = await trigger(payload);
      return response;
    } catch (error) {
      console.error("Error al finalizar tratamiento:", error);
      throw error;
    }
  };

  return { postDischarge, loading, error };
};

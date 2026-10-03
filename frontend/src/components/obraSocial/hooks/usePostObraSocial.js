import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const usePostObraSocial = () => {
  const { trigger, loading, error } = useApi({
    url: "/obras-sociales",
    method: "POST",
  });

  const postObraSocial = async (formData) => {
    try {
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        id_user: getUser().id || undefined,
      };

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al crear la obra social:", error);
      throw error;
    }
  };

  return { postObraSocial, loading, error };
};

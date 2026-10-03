import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const useUpdateObraSocial = (dataUpdateObraSocial) => {
  const { trigger, loading, error } = useApi({
    id: dataUpdateObraSocial?.id,
    url: "/obras-sociales",
    method: "PATCH",
  });

  const updateObraSocial = async (formData) => {
    try {
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        id_user: getUser().id || undefined,
      };

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al actualizar la obra social:", error);
      throw error;
    }
  };

  return { updateObraSocial, loading, error };
};

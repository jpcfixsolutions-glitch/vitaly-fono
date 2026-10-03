import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const useUpdateTypeService = (dataUpdateTypeService) => {
  const { trigger, loading, error } = useApi({
    id: dataUpdateTypeService?.id,
    url: "/tipo-servicio",
    method: "PATCH",
  });

  const updateTypeService = async (formData) => {
    try {
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        description: formData?.description ? String(formData.description).trim() : "",
        price: formData?.price !== undefined ? Number(formData.price) : undefined,
        id_user: getUser().id || undefined,
      };

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al actualizar el tipo de servicio:", error);
      throw error;
    }
  };

  return { updateTypeService, loading, error };
};

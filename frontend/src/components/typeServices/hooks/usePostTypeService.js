import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const usePostTypeService = () => {
    const { trigger, loading, error } = useApi({
      url: "/tipo-servicio",
      method: "POST",
    });

  const postTypeService = async (formData) => {
    try {
      const sanitizedData = {
        name: formData?.name ? String(formData.name).trim() : undefined,
        description: formData?.description ? String(formData.description).trim() : "",
        price: formData?.price !== undefined ? Number(formData.price) : undefined,
        id_user: getUser().id || undefined,
        // Forzar estatus activo para reactivación (el backend usa este valor en la rama "update")
        status: "Activo",
      };

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al crear el tipo de servicio:", error);
      throw error;
    }
  };

  return { postTypeService, loading, error };
};

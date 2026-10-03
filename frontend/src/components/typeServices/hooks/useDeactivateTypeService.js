import { useApi } from "../../../hooks";

export const useDeactivateTypeService = (dataDeactivateTypeService) => {
  const { trigger, loading, error } = useApi({
    id: dataDeactivateTypeService?.id,
    url: "/tipo-servicio",
    method: "DELETE",
  });

  const deactivateTypeService = async () => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.error("Error al dar de baja el tipo de servicio:", error);
      throw error;
    }
  };

  return { deactivateTypeService, loading, error };
};

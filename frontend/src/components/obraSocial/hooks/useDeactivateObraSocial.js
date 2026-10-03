import { useApi } from "../../../hooks";

export const useDeactivateObraSocial = (dataDeactivateObraSocial) => {
  const { trigger, loading, error } = useApi({
    id: dataDeactivateObraSocial?.id,
    url: "/obras-sociales",
    method: "DELETE",
  });

  const deactivateObraSocial = async () => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.error("Error al dar de baja la obra social:", error);
      throw error;
    }
  };

  return { deactivateObraSocial, loading, error };
};

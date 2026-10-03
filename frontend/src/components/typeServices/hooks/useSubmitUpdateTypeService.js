import { useState } from "react";
import { useUpdateTypeService } from "./useUpdateTypeService";
import { closeModal } from "../../../utils";

export const useSubmitUpdateTypeService = (dataUpdateTypeService) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    updateTypeService,
    loading: apiLoadingUpdateTypeService,
    error: apiErrorUpdateTypeService,
  } = useUpdateTypeService(dataUpdateTypeService);

  const onUpdateTypeService = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await updateTypeService(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Tipo de servicio actualizado correctamente!");
        setTimeout(() => {
          closeModal("updateTypeServiceModal");
          window.location.reload();
        }, 2250);
      } else {
        setErrorMessage(response?.message);
      }
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setErrorMessage(null);
      setIsLoading(false);
    }
  };

  return {
    successMessage,
    errorMessage,
    isLoading,
    apiLoadingUpdateTypeService,
    apiErrorUpdateTypeService,
    onUpdateTypeService,
  };
};

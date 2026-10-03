import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeactivateTypeService } from "./useDeactivateTypeService";

export const useSubmitDeactivateTypeService = (dataDeactivateTypeService) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    deactivateTypeService,
    loading: apiLoadingDeactivateTypeService,
    error: apiErrorDeactivateTypeService,
  } = useDeactivateTypeService(dataDeactivateTypeService);

  const onDeactivateTypeService = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await deactivateTypeService();
      if (response?.status === "success") {
        setSuccessMessage("¡Tipo de servicio dado de baja correctamente!");
        setTimeout(() => {
          closeModal("deactivateTypeServiceModal");
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
    apiLoadingDeactivateTypeService,
    apiErrorDeactivateTypeService,
    onDeactivateTypeService,
  };
};

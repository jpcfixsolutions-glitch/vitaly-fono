import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeactivateObraSocial } from "./useDeactivateObraSocial";

export const useSubmitDeactivateObraSocial = (dataDeactivateObraSocial) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    deactivateObraSocial,
    loading: apiLoadingDeactivateObraSocial,
    error: apiErrorDeactivateObraSocial,
  } = useDeactivateObraSocial(dataDeactivateObraSocial);

  const onDeactivateObraSocial = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await deactivateObraSocial();
      if (response?.status === "success") {
        setSuccessMessage("¡Obra Social dada de baja correctamente!");
        setTimeout(() => {
          closeModal("deactivateObraSocialModal");
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
    apiLoadingDeactivateObraSocial,
    apiErrorDeactivateObraSocial,
    onDeactivateObraSocial,
  };
};

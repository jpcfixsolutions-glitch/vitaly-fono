import { useState } from "react";
import { useUpdateObraSocial } from "./useUpdateObraSocial";
import { closeModal } from "../../../utils";

export const useSubmitUpdateObraSocial = (dataUpdateObraSocial) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    updateObraSocial,
    loading: apiLoadingUpdateObraSocial,
    error: apiErrorUpdateObraSocial,
  } = useUpdateObraSocial(dataUpdateObraSocial);

  const onUpdateObraSocial = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await updateObraSocial(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Obra Social actualizada correctamente!");
        setTimeout(() => {
          closeModal("updateObraSocialModal");
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
    apiLoadingUpdateObraSocial,
    apiErrorUpdateObraSocial,
    onUpdateObraSocial,
  };
};

import { useState } from "react";
import { usePostObraSocial } from "./usePostObraSocial";
import { closeModal } from "../../../utils";

export const useSubmitPostObraSocial = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    postObraSocial,
    loading: apiLoadingPostObraSocial,
    error: apiErrorPostObraSocial,
  } = usePostObraSocial();

  const onSubmitObraSocial = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await postObraSocial(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Obra Social creada correctamente!");
        setTimeout(() => {
          closeModal("createObraSocialModal");
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
    apiLoadingPostObraSocial,
    apiErrorPostObraSocial,
    onSubmitObraSocial,
  };
};

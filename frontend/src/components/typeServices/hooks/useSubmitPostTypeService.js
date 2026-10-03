import { useState } from "react";
import { usePostTypeService } from "./usePostTypeService";
import { closeModal } from "../../../utils";

export const useSubmitPostTypeService = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    postTypeService,
    loading: apiLoadingPostTypeService,
    error: apiErrorPostTypeService,
  } = usePostTypeService();

  const onSubmitTypeService = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await postTypeService(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Tipo de servicio creado correctamente!");
        setTimeout(() => {
          closeModal("createTypeServiceModal");
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
    apiLoadingPostTypeService,
    apiErrorPostTypeService,
    onSubmitTypeService,
  };
};

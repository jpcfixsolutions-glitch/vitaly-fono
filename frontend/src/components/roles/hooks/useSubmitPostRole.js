import { useState } from "react";
import { closeModal } from "../../../utils";
import { usePostRole } from "./usePostRole";

export const useSubmitPostRole = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    postRole,
    loading: apiLoadingPostRole,
    error: apiErrorPostRole,
  } = usePostRole();

  const onSubmitRole = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await postRole(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Rol creado correctamente!");
        setTimeout(() => {
          closeModal("createRoleModal");
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
    apiLoadingPostRole,
    apiErrorPostRole,
    onSubmitRole,
  };
};

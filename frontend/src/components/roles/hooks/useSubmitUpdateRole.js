import { useState } from "react";
import { closeModal } from "../../../utils";
import { useUpdateRole } from "./useUpdateRole";

export const useSubmitUpdateRole = (dataUpdateRole) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    updateRole,
    loading: apiLoadingUpdateRole,
    error: apiErrorUpdateRole,
  } = useUpdateRole(dataUpdateRole);

  const onUpdateRole = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await updateRole(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Rol actualizado correctamente!");
        setTimeout(() => {
          closeModal("updateRoleModal");
          // window.location.reload();
        }, 2250);
      } else {
        setErrorMessage(response?.message);
      }
      return response;
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
    apiLoadingUpdateRole,
    apiErrorUpdateRole,
    onUpdateRole,
  };
};

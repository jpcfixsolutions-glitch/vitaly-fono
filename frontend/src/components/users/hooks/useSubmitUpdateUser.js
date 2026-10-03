import { useState } from "react";
import { closeModal } from "../../../utils";
import { useUpdateUser } from "./useUpdateUser";

export const useSubmitUpdateUser = (dataUpdateUser) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    updateUser,
    loading: apiLoadingUpdateUser,
    error: apiErrorUpdateUser,
  } = useUpdateUser(dataUpdateUser);

  const onUpdateUser = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await updateUser(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Usuario actualizado correctamente!");
        setTimeout(() => {
          closeModal("updateUserModal");
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
    apiLoadingUpdateUser,
    apiErrorUpdateUser,
    onUpdateUser,
  };
};

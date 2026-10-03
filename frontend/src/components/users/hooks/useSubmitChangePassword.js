import { useState } from "react";
import { closeModal } from "../../../utils";
import { useUpdatePassword } from "./useUpdatePassword";

export const useSubmitChangePassword = (dataChangePassword) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    updatePassword,
    loading: apiLoadingUpdatePassword,
    error: apiErrorUpdatePassword,
  } = useUpdatePassword(dataChangePassword);

  const onChangePassword = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await updatePassword(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Contraseña actualizada correctamente!");
        setTimeout(() => {
          closeModal("changePasswordModal");
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
    apiLoadingUpdatePassword,
    apiErrorUpdatePassword,
    onChangePassword,
  };
};

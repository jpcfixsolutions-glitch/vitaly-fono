import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeactivateUser } from "./useDeactivateUser";

export const useSubmitDeactivateUser = (dataDeactivateUser) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    deactivateUser, 
    loading: apiLoadingDeactivateUser, 
    error: apiErrorDeactivateUser,
  } = useDeactivateUser(dataDeactivateUser);

  const onDeactivateUser = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await deactivateUser();
      if (response?.status === 'success') {
        setSuccessMessage('¡Usuario dado de baja correctamente!');
        setTimeout(() => {
          closeModal('deactivateUserModal');
          window.location.reload();
        }, 2250);
      } else {
        setErrorMessage(response?.message);
      }
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      // setErrorMessage(null);
      setIsLoading(false);
    }
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    apiLoadingDeactivateUser,
    apiErrorDeactivateUser,
    onDeactivateUser,
  }
}
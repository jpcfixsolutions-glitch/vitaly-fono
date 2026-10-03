import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeactivateRole } from "./useDeactivateRole";

export const useSubmitDeactivateRole = (dataDeactivateRole) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    deactivateRole, 
    loading: apiLoadingDeactivateRole, 
    error: apiErrorDeactivateRole, 
  } = useDeactivateRole(dataDeactivateRole);

  const onDeactivateRole = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await deactivateRole();
      if (response?.status === 'success') {
        setSuccessMessage('¡Rol dado de baja correctamente!');
        setTimeout(() => {
          closeModal('deactivateRoleModal');
          window.location.reload();
        }, 2250);
      } else {
        setErrorMessage(response?.message);
      }
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    apiLoadingDeactivateRole,
    apiErrorDeactivateRole,
    onDeactivateRole,
  }
}

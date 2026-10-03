import { useState } from "react";
import { useUpdatePaymentMethod } from "./useUpdatePaymentMethod";
import { closeModal } from "../../../utils";

export const useSubmitUpdatePaymentMethod = (dataUpdatePaymentMethod) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    updatePaymentMethod, 
    loading: apiLoadingUpdatePaymentMethod, 
    error: apiErrorUpdatePaymentMethod,
  } = useUpdatePaymentMethod(dataUpdatePaymentMethod);

  const onUpdatePaymentMethod = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await updatePaymentMethod(data);
      if (response?.status === 'success') {
        setSuccessMessage('¡Método de pago actualizado correctamente!');
        setTimeout(() => {
          closeModal('updatePaymentMethodModal');
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
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    apiLoadingUpdatePaymentMethod,
    apiErrorUpdatePaymentMethod,
    onUpdatePaymentMethod,
  }
}
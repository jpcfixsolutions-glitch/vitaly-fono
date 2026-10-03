import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeactivatePaymentMethod } from "./useDeactivatePaymentMethod";

export const useSubmitDeactivatePaymentMethod = (dataDeactivatePaymentMethod) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    deactivatePaymentMethod, 
    loading: apiLoadingDeactivatePaymentMethod, 
    error: apiErrorDeactivatePaymentMethod,
  } = useDeactivatePaymentMethod(dataDeactivatePaymentMethod);

  const onDeactivatePaymentMethod = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await deactivatePaymentMethod();
      if (response?.status === 'success') {
        setSuccessMessage('¡Método de pago dado de baja correctamente!');
        setTimeout(() => {
          closeModal('deactivatePaymentMethodModal');
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
    apiLoadingDeactivatePaymentMethod,
    apiErrorDeactivatePaymentMethod,
    onDeactivatePaymentMethod,
  }
}
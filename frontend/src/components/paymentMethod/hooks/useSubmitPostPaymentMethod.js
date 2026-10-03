import { useState } from "react";
import { usePostPaymentMethod } from "./usePostPaymentMethod";
import { closeModal } from "../../../utils";

export const useSubmitPostPaymentMethod = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    postPaymentMethod, 
    loading: apiLoadingPostPaymentMethod, 
    error: apiErrorPostPaymentMethod,
  } = usePostPaymentMethod();

  const onSubmitPaymentMethod = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await postPaymentMethod(data);
      if (response?.status === 'success') {
        setSuccessMessage('¡Método de pago creado correctamente!');
        setTimeout(() => {
          closeModal('createPaymentMethodModal');
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
    apiLoadingPostPaymentMethod,
    apiErrorPostPaymentMethod,
    onSubmitPaymentMethod,
  }
}
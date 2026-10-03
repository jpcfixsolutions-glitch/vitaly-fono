import { useState } from "react";
import { usePaymentPost } from "./usePaymentPost";
import { closeModal } from "../../../utils";

export const usePaymentSubmitPost = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { postPayment, loading: apiLoadingPostPayment, error: apiErrorPostPayment } = usePaymentPost();

  const onSubmitPayment = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await postPayment(data);
      if (response?.status === 'success') {
        setSuccessMessage('¡Cobro registrado correctamente!');
        setTimeout(() => {
          closeModal('formAddPayment');
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
    apiLoadingPostPayment,
    apiErrorPostPayment,
    onSubmitPayment
  }
}
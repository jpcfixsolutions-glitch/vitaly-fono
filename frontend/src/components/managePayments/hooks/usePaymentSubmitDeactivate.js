import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeactivatePayment } from "./useDeactivatePayment";

export const usePaymentSubmitDeactivate = (dataDeactivatePaymentHistory) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    deactivatePaymentHistory,
    loading: apiLoadingDeactivatePaymentHistory,
    error: apiErrorDeactivatePaymentHistory
  } = useDeactivatePayment(dataDeactivatePaymentHistory);

  const onSubmitDeactivatePaymentHistory = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await deactivatePaymentHistory();
      if (response?.status === 'success') {
        setSuccessMessage('¡Cobro anulado correctamente!');
        setTimeout(() => {
          closeModal('deactivatePaymentHistoryModal');
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
    apiLoadingDeactivatePaymentHistory,
    apiErrorDeactivatePaymentHistory,
    onSubmitDeactivatePaymentHistory
  }
}
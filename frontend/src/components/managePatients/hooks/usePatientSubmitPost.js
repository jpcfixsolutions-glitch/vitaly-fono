import { useState } from "react";
import { usePostPatient } from "../../../hooks/usePostPatient";
import { closeModal } from "../../../utils";

export const usePatientSubmitPost = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    postPatient, 
    loading: apiLoadingPostPatient, 
    error: apiErrorPostPatient 
  } = usePostPatient();

  const onSubmitPatient = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try {
      const response = await postPatient(data);
      if (response?.status === 'success') {
        setSuccessMessage('¡Paciente registrado correctamente!');
        setTimeout(() => {
          closeModal('formAddPatient');
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
    apiLoadingPostPatient,
    apiErrorPostPatient,
    onSubmitPatient
  }
}
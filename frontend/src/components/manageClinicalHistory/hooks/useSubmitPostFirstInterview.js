import { useState } from "react";
import { usePostFirstInterview } from "./usePostFirstInterview";
import { closeModal } from "../../../utils";

export const useSubmitPostFirstInterview = (selectedPatient) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const id_patient = selectedPatient?.id;
  
  const { 
    postFirstInterview, 
    loading: apiLoadingPostFirstInterview, 
    error: apiErrorPostFirstInterview 
  } = usePostFirstInterview();

  const onSubmitFirstInterview = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      const response = await postFirstInterview(data, id_patient);
      
      if (response?.status !== 'success') {
        setErrorMessage(response?.message || 'Error al registrar la primera entrevista');
        setIsLoading(false);
        return;
      }

      // Si todos los posts fueron exitosos, mostrar mensaje de éxito
      setSuccessMessage('¡Entrevista registrada correctamente!');
      setTimeout(() => {
        closeModal('interviewModal');
        window.location.reload();
      }, 2250);

    } catch (e) {
      setErrorMessage(e?.message || 'Error inesperado al registrar la entrevista');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    apiLoadingPostFirstInterview,
    apiErrorPostFirstInterview,
    onSubmitFirstInterview
  }
}
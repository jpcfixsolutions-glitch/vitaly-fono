import { useState } from "react";
import { useUpdateFirstInterviewForAdults } from "./useUpdateFirstInterviewForAdults";
import { closeModal } from "../../../utils";

export const useSubmitUpdateFirstInterviewForAdults = (currentInterview) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const id_patient = currentInterview?.patient?.id;
  const id_interview = currentInterview?.interview?.id;
  
  const { updateFirstInterviewForAdults } = useUpdateFirstInterviewForAdults();

  const onSubmitUpdateFirstInterviewForAdults = async (data) => {

    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      if (!id_interview) {
        throw new Error("No se pudo identificar la entrevista para actualizar.");
      }

      const response = await updateFirstInterviewForAdults(id_interview, data, id_patient);

      // Verificamos si la respuesta del backend indica error aunque el status HTTP sea exitoso
      if (response?.status === 'error' || !response) {
        throw new Error(response?.message || 'Error al actualizar la entrevista');
      }

      setSuccessMessage('¡Entrevista actualizada correctamente!');
      setTimeout(() => {
        // closeModal('updateFirstInterviewModal');
        // window.location.reload();
      }, 2250);

    } catch (e) {
      console.error(e);
      setErrorMessage(e?.message || 'Error inesperado al actualizar la entrevista');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    onSubmitUpdateFirstInterviewForAdults
  }
}

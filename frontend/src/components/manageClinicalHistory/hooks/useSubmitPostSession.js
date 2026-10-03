import { useState } from "react";
import { usePostSession } from "./usePostSession";
import { closeModal } from "../../../utils";

export const useSubmitPostSession = (selectedPatient) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const id_patient = selectedPatient?.id;
  
  const { postSession } = usePostSession();

  const onSubmitPostSession = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      if (!id_patient) {
        throw new Error("No hay paciente seleccionado para crear la sesión.");
      }

      const response = await postSession(data, id_patient);
      
      // Verificamos si la respuesta del backend indica error
      if (response?.status === 'error' || !response) {
        throw new Error(response?.message || 'Error al registrar la sesión');
      }

      setSuccessMessage('¡Sesión registrada correctamente!');
      setTimeout(() => {
        closeModal('postSessionModal'); // Asegúrate que este ID coincida con tu modal
        window.location.reload();
      }, 2250);

    } catch (e) {
      console.error(e);
      setErrorMessage(e?.message || 'Error inesperado al registrar la sesión');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    onSubmitPostSession
  }
}

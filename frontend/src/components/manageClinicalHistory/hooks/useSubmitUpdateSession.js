import { useState } from "react";
import { useUpdateSession } from "./useUpdateSession";
import { closeModal } from "../../../utils";

export const useSubmitUpdateSession = (currentSession) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const id_session = currentSession?.id;
  const id_patient = currentSession?.id_patient;

  const { updateSession } = useUpdateSession();

  const onSubmitUpdateSession = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!id_session) {
        throw new Error("No se pudo identificar la sesión para actualizar.");
      }

      const response = await updateSession(id_session, data, id_patient);
      
      // Verificamos si la respuesta del backend indica error
      if (response?.status === 'error' || !response) {
        throw new Error(response?.message || 'Error al actualizar la sesión');
      }

      setSuccessMessage('¡Sesión actualizada correctamente!');
      setTimeout(() => {
        closeModal('updateSessionModal'); // Asegúrate que este ID coincida con tu modal
        window.location.reload();
      }, 2250);

    } catch (e) {
      console.error(e);
      setErrorMessage(e?.message || 'Error inesperado al actualizar la sesión');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    successMessage,
    errorMessage,
    isLoading,
    onSubmitUpdateSession
  }
}

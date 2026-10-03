import { useState } from "react";
import { usePostDischarge } from "./usePostDischarge";
import { closeModal } from "../../../utils";

export const useSubmitDischarge = (selectedPatient) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { postDischarge } = usePostDischarge();

  const onSubmitDischarge = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!selectedPatient?.id) {
        throw new Error("No hay paciente seleccionado.");
      }

      const response = await postDischarge(data, selectedPatient.id);

      if (response?.status === 'error' || !response) {
        throw new Error(response?.message || 'Error al finalizar el tratamiento');
      }

      setSuccessMessage('¡Tratamiento finalizado correctamente!');
      setTimeout(() => {
        closeModal('dischargeModal');
        window.location.reload(); 
      }, 2250);

    } catch (e) {
      console.error(e);
      setErrorMessage(e?.message || 'Error inesperado al finalizar el tratamiento');
    } finally {
      setIsLoading(false);
    }
  };

  return { successMessage, errorMessage, isLoading, onSubmitDischarge };
};

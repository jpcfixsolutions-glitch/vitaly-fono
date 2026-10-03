import { useState } from 'react';
import { useUpdatePatient } from '.';
import { closeModal } from '../../../utils';

export const usePatientSubmitUpdate = (dataUpdatePatient, transformedDocumentTypes, transformedHealthInsurance) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updatePatient, loading: apiLoadingUpdatePatient, error: apiErrorUpdatePatient } = useUpdatePatient(dataUpdatePatient, transformedDocumentTypes, transformedHealthInsurance);

  const onUpdatePatient = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    setIsLoading(true);
    try { 
      const response = await updatePatient(data);
      if (response?.status === 'success') {
        setSuccessMessage('¡Paciente actualizado correctamente!');
        setTimeout(() => {
          closeModal('updatePatientModal');
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
    apiLoadingUpdatePatient,
    apiErrorUpdatePatient,
    onUpdatePatient,
  };
};

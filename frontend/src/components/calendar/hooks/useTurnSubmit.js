import { useState } from 'react';
import { validateFormData } from '../utils/validations';
import { buildPatientPayload, buildTurnPayload } from '../utils/buildPayloads';
import { usePostTurns } from './usePostTurns';
import { closeModal } from '../../../utils';
import { usePostPatient } from '../../managePatients';
import { getUser } from '../../../utils/getUser';

export const useTurnSubmit = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [validatingFormData, setValidatingFormData] = useState(false);

  const { postTurn, loading: apiLoadingPostTurn, error: apiErrorPostTurn } = usePostTurns();
  const { postPatient, loading: apiLoadingPostPatient, error: apiErrorPostPatient } = usePostPatient();

  const onSubmitTurn = async (data) => {
    // Limpiamos mensajes previos para asegurar que el hook de visibilidad detecte el cambio
    setSuccessMessage(null);
    setErrorMessage(null);
    
    setValidatingFormData(true);
    try {
      const { isValidData, status, message } = await validateFormData(data);

      if (status === 'error') {
        setErrorMessage(message);
        setValidatingFormData(false);
        return;
      }
      
      const patientFound = isValidData?.status === 'success' && isValidData?.data;

      if (patientFound) {
        // El paciente existe. Construyo el payload del turno debido a que solo hay que crear el turno.
        const payloadTurn = buildTurnPayload(data);
        payloadTurn.id_patient = isValidData.data.id;
        payloadTurn.id_user = data.id_user || getUser().id;

        const response = await postTurn(payloadTurn);

        if (response?.status === 'success') {
          setSuccessMessage('¡Turno creado correctamente!');
          setTimeout(() => {
            closeModal('registrarTurnoModal');
            window.location.reload();
          }, 2250);
        } else {
          setErrorMessage(response?.message);
        }
      } 
      else {
        // El paciente no existe. Hay que crear el paciente y el turno.
        const payloadPatient = buildPatientPayload(data);
        payloadPatient.id_user = data.id_user || getUser().id;

        const responsePatient = await postPatient(payloadPatient);
        if (responsePatient?.status !== 'success') {
          setErrorMessage(responsePatient?.message);
          return;
        }

        const payloadTurn = buildTurnPayload(data);
        payloadTurn.id_patient = responsePatient.data.id;
        payloadTurn.id_user = data.id_user || getUser().id;

        const responseTurn = await postTurn(payloadTurn);
        if (responseTurn?.status === 'success') {
          setSuccessMessage('¡Paciente y turno creados correctamente!');
          setTimeout(() => {
            closeModal('registrarTurnoModal');
            window.location.reload();
          }, 2250);
        } else {
          setErrorMessage(responseTurn?.message);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setValidatingFormData(false);
    }
  };

  return {
    successMessage,
    errorMessage,
    validatingFormData,
    apiLoadingPostTurn,
    apiErrorPostTurn,
    apiLoadingPostPatient,
    apiErrorPostPatient,
    onSubmitTurn
  };
};


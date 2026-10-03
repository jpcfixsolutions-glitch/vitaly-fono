import { useGetPatientByDocumentNumber } from "../hooks/useGetPatientByDocumentNumber";

/**
 * Verifica si el array de businessHours contiene al menos un rango válido 
 * (es decir, que al menos un objeto tenga startTime distinto de endTime).
 * Si hay al menos un rango válido, retorna la cadena 'businessHours'; 
 * si no, retorna undefined.
 *
 * El valor de retorno 'businessHours' para constraint habilita la restricción 
 * en FullCalendar para que solo se puedan crear o mover eventos dentro de los 
 * rangos definidos en businessHours. Si el valor es undefined, 
 * no se aplican restricciones y se permiten acciones fuera de los horarios definidos.
 *
 * @param {Array} businessHours - Array de objetos que representan los horarios de atención, cada uno con propiedades startTime y endTime.
 * @returns {string|undefined} - Retorna 'businessHours' para restringir a esos horarios, o undefined para no restringir.
 */
export const hasValidBusinessHours = (businessHours) => {
  const hasValidBusinessHours = Array.isArray(businessHours) && businessHours.some((h) => h?.startTime !== h?.endTime);
  const constraint = hasValidBusinessHours ? 'businessHours' : undefined;
  return constraint;
};

export const validateFormData = async (data) => {
  const { id_document_type, document_number, new_patient } = data;

  const dataPatient = await useGetPatientByDocumentNumber(id_document_type, document_number);

  if (dataPatient.status === 'success' && new_patient) {
    // Tendría que tirar un error, porque el paciente existe y esta marcando que es nuevo.
    // acá tendría que mostrar un error en el formulario.
    return { isValidData: dataPatient, status: 'error', message: 'El paciente se encuentra registrado en el sistema. Por favor, desmarque la opción "Es paciente nuevo".' };
  }

  if (dataPatient.status === 'success' && !new_patient) {
    // Este sería el caso correcto, porque el paciente existe y no esta marcando que es nuevo.
    // acá tendría que registrar el turno normal y tendría que mostrar un mensaje de éxito en el formulario.
    return { isValidData: dataPatient, status: 'success', message: 'Paciente validado correctamente.' };
  }

  if (dataPatient.status === 'error' && !new_patient) {
    // Tendría que tirar un error, porque el paciente no existe y no esta marcando que es nuevo.
    // acá tendría que mostrar un error en el formulario.
    return { isValidData: [], status: 'error', message: "Paciente no registrado. Marque 'Es paciente nuevo' o regístrelo." };
  }

  if (dataPatient.status === 'error' && new_patient) {
    // Este sería el caso correcto, porque el paciente no existe y esta marcando que es nuevo.
    // acá tendría que registrar el paciente y el turno.
    return { isValidData: dataPatient, status: 'success', message: 'El sistema registrará el paciente y el turno.' };
  }
}

import apiClient from "../../../services/apiClient";

/**
 * Obtiene la información de un paciente por tipo y número de documento.
 *
 * @async
 * @function useGetPatientByDocumentNumber
 * @param {string|number} id_document_type - El ID del tipo de documento del paciente.
 * @param {string|number} document_number - El número de documento del paciente.
 * @returns {Promise<{data: Array|Object, status: string, message?: string}>} 
 * Un objeto con la información del paciente, el estado de la petición y un mensaje de error si aplica.
 */
export const useGetPatientByDocumentNumber = async (id_document_type, document_number) => {
  try {
    const response = await apiClient({
      url: `/pacientes/${id_document_type}/${document_number}`,
      method: 'GET',
    });

    const dataPatient = response.data;

    if (response.data.status !== 'success') {
      return { data: [], status: 'error', message: 'Paciente no encontrado.' };
    }

    return dataPatient;

  } catch (error) {
    return { data: [], status: 'error', message: 'Paciente no encontrado.' };
  }
};
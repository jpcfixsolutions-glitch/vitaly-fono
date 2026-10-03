import { formatDateForInput } from '../utils/format';
import { getIdDocumentTypeByName } from './getIdDocumentTypeByName';
import { getIdHealthInsuranceByName } from './getIdHealthInsuranceByName';

/**
 * Transforma los valores iniciales para el formulario de pacientes.
 * Mapea fechas, tipos de documento y obras sociales a los formatos esperados por los inputs.
 *
 * @param {Object} initialValues - Valores iniciales del paciente.
 * @param {Array} documentTypes - Lista de tipos de documentos disponibles.
 * @param {Array} healthInsurance - Lista de obras sociales disponibles.
 * @returns {Object|undefined} - Valores transformados o undefined si no hay valores iniciales.
 */
export const transformPatientInitialValues = (initialValues, documentTypes, healthInsurance) => {
  if (!initialValues) return undefined;

  const idDocumentType = getIdDocumentTypeByName(documentTypes, initialValues.id_document_type);
  const idHealthInsurance = getIdHealthInsuranceByName(healthInsurance, initialValues.id_health_insurance);

  return {
    ...initialValues,
    birth_date: formatDateForInput(initialValues.birth_date),
    id_document_type: idDocumentType[0],
    id_health_insurance: idHealthInsurance[1],
    address: initialValues.address === "null" || initialValues.address === '-' ? '' : initialValues.address,
    phone: initialValues.phone === "null" ? '' : initialValues.phone,
    email: initialValues.email === "null" ? '' : initialValues.email,
  }
};


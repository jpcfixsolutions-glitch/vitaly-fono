import { toInputDate } from './date';

/**
 * Formatea un número de teléfono para mostrarlo como XXX-XXX-XXXX.
 *
 * @param {string|number} phone - El número de teléfono a formatear.
 * @returns {string} El número de teléfono formateado o el original si no coincide el formato esperado.
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '-';
  const cleaned = String(phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Mapea los valores iniciales de un paciente a los nombres de campos del formulario de primera entrevista.
 * Convierte los campos del backend (name, last_name, birth_date, etc.) a los nombres esperados por el formulario
 * (completeName, birth_date, direccion, etc.).
 * 
 * @param {Object|null} patient - Objeto con los datos del paciente (name, last_name, birth_date, address, phone)
 * @returns {Object} Objeto con los valores mapeados para el formulario o objeto vacío si patient es null
 */
export const mapPatientToFirstInterviewInitialValues = (patient) => {
  if (!patient) return {};
  
  return {
    complete_name: `${patient.name || ''} ${patient.last_name || ''}`.trim(),
    birth_date: toInputDate(patient.birth_date),
    address: patient.address || '',
    phone: patient.phone || '',
  };
};
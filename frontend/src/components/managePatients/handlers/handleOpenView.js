import { findPatientByDocument } from '../utils';

/**
 * Manejador para abrir el modal de vista de un paciente.
 *
 * @param {Array} dataPatient - Array de pacientes.
 * @param {Function} setSelectedPatient - Setter para el paciente seleccionado.
 * @returns {Function} Función que toma un objeto de fila y abre el modal de vista.
 */
export const handleOpenView = (dataPatient, setSelectedPatient) => (row) => {
  const originalPatient = findPatientByDocument(dataPatient, row.document_number);
  setSelectedPatient(originalPatient);
};


import React from 'react';
import { findPatientByDocument } from '../utils';

/**
 * Componente que muestra el estado del paciente ("Activo" o "Inactivo") con estilos visuales.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.row - Fila de datos del paciente (usada para obtener el documento).
 * @param {Object} props.dataPatient - Objeto que contiene los datos de todos los pacientes.
 * @returns {JSX.Element}
 */
export const StatusCell = ({ row, dataPatient }) => {
  // Busca el paciente original basado en el número de documento.
  const originalPatient = findPatientByDocument(dataPatient, row.document_number);

  // Verifica si el paciente está activo (status === "Activo" o true).
  const isActive = originalPatient?.status === "Activo" || originalPatient?.status === true;

  // Texto a mostrar según estado.
  const statusText = isActive ? "Activo" : "Inactivo";

  // Clase CSS a aplicar según estado.
  const statusClass = isActive ? "patient-status--active" : "patient-status--inactive";

  return (
    <span className={`patient-status ${statusClass}`}>
      {statusText}
    </span>
  );
};


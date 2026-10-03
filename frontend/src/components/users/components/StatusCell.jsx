import React from 'react';
import { findUserByEmail } from '../utils';

/**
 * Componente que muestra el estado del usuario ("Activo" o "Inactivo") con estilos visuales.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.row - Fila de datos del usuario (usada para obtener el email).
 * @param {Object} props.dataUser - Objeto que contiene los datos de todos los usuarios.
 * @returns {JSX.Element}
 */
export const StatusCell = ({ row, dataUser }) => {
  const originalUser = findUserByEmail(dataUser, row.email);
  const isActive = originalUser?.status === "Activo" || originalUser?.status === true;
  const statusText = isActive ? "Activo" : "Inactivo";
  const statusClass = isActive ? "patient-status--active" : "patient-status--inactive"; // Aplica las mismas clases de estilo que el componente de pacientes.

  return (
    <span className={`patient-status ${statusClass}`}>
      {statusText}
    </span>
  );
};


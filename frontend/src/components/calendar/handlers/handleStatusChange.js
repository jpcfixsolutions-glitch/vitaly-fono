/**
 * Genera un handler para cambiar el estado de un turno en el calendario.
 *
 * @param {function} onChangeStatus - Función callback para actualizar el estado. Debe aceptar un string (nuevo estado) como argumento.
 * @param {string} currentStatusKey - Clave del estado actual (en formato del frontend).
 * @returns {function} - Función handler para el evento onChange de un select.
 */
export const handleStatusChange = (onChangeStatus, currentStatusKey) => (e) => {
  const newStatusKey = e.target.value;
  if (onChangeStatus && newStatusKey !== currentStatusKey) {
    // Capitaliza la primera letra para cumplir con el formato esperado por el backend
    onChangeStatus(newStatusKey.charAt(0).toUpperCase() + newStatusKey.slice(1));
  }
}
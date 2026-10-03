import { openModal } from "../../../utils";

/**
 * Handler para abrir el modal de edición de sesión
 * @param {Object} session - Objeto de la sesión a editar
 * @param {Function} setEditingSession - Función para actualizar el estado de la sesión en edición
 */
export const handleEditSession = (session, setEditingSession) => {
  setEditingSession(session);
  openModal('updateSessionModal');
};

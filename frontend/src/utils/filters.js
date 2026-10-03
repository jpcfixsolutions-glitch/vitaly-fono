/**
 * Filtra los datos por el estado
 * @param {Object} data - Datos a filtrar
 * @returns {Object} Datos filtrados
 */
const filterByStatus = (input) => {
  const items = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item?.status === "Activo");
}

const filterByPagadaStatus = (input) => {
  const items = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item?.status === "Pagada");
}

/**
 * Filtra los turnos para excluir aquellos cuyo estado sea "cancelado".
 *
 * @param {Array|Object} input - Lista de turnos o un objeto que tenga una propiedad 'data' con la lista de turnos.
 * Cada turno debe tener una propiedad 'status'.
 * @returns {Array} Lista de turnos cuyo estado NO es "cancelado".
 */
const filterByStatusTurn = (input) => {
  const items = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(items)) return [];
  const isCanceled = (status) => {
    if (typeof status !== 'string') return false;
    return status.toLowerCase().trim() === 'cancelado';
  };
  return items.filter((item) => !isCanceled(item?.status));
}

/**
 * Filtra los elementos de la lista para incluir solo aquellos que pertenecen al usuario actualmente autenticado.
 * El usuario actual se determina a partir del objeto 'user' almacenado en localStorage.
 *
 * @param {Array|Object} input - Una lista de objetos (por ejemplo, turnos), o un objeto que tenga una propiedad 'data' con dicha lista.
 * Cada elemento debe tener la propiedad 'id_user'.
 * @returns {Array} Una lista filtrada que solo contiene elementos cuyo 'id_user' coincide con el usuario autenticado.
 */
const filterByUser = (input) => {
  const rawUser = localStorage.getItem('user');
  const parsed = rawUser ? JSON.parse(rawUser) : null;
  const currentUserId = parsed?.id;
  const currentUserRole = parsed?.role;

  const items = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(items)) return [];

  if (currentUserRole === 'Recepción' || currentUserRole === 'Administrador') {
    return items;
  }

  const filteredItems = items.filter((item) => item?.id_user === currentUserId);
  return filteredItems;
}

const filterByRole = (input) => {
  const items = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item?.role !== "Administrador");
}

export { filterByStatus, filterByPagadaStatus, filterByStatusTurn, filterByUser, filterByRole };

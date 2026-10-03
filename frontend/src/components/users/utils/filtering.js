/**
 * Busca un usuario por su correo electrónico en una fuente de usuarios.
 *
 * @param {Array|Object} source - Puede ser un array de usuarios directamente, 
 *   o un objeto que contiene la propiedad 'data' con el array de usuarios.
 * @param {string} email - El correo electrónico del usuario a buscar.
 * @returns {Object|undefined} El objeto usuario que coincide con el correo, o undefined si no se encuentra.
 */
export const findUserByEmail = (source, email) => {
  const base = Array.isArray(source?.data) ? source.data : Array.isArray(source) ? source : [];
  return base.find(u => u.email === email);
};
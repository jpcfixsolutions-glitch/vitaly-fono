/**
 * Sanitiza la respuesta de autenticación.
 * 
 * @param {Object} user - Objeto de usuario completo.
 * @param {string} accessToken - Token de acceso.
 * @param {Object} userPrivileges - Privilegios del usuario.
 * @returns {Object} Objeto sanitizado para enviar al cliente.
 */
export const sanitizeAuthResponse = (user, accessToken, userPrivileges) => {
  const { password, ...userWithoutPassword } = user;
  
  return {
    accessToken,
    privileges: userPrivileges,
    user: userWithoutPassword
  };
};


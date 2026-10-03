import { sendError } from '../utils/response.js';

/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos.
 *
 * @param {string[]} allowedRoles - Lista de nombres de roles permitidos para acceder a la ruta.
 * @returns {Function} Middleware de Express que verifica el rol del usuario.
 *
 * El middleware asume que existe un objeto `user` en `req` (establecido por un middleware previo de autenticación)
 * con una propiedad `role` que indica el rol actual del usuario autenticado.
 *
 * Si el usuario no tiene uno de los roles permitidos, responde con estatus 403 y mensaje de error.
 */
export const role = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return sendError(res, 403, "Acceso denegado: No tienes permisos para acceder a esta ruta");
      }
      next();
    } catch (error) {
      return sendError(res, 500, "Error interno al validar permisos");
    }
  };
};
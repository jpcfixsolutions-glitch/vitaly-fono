import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

/**
 * Middleware para autenticar solicitudes usando JWT.
 *
 * Busca el token JWT en el encabezado "Authorization" de la petición HTTP, 
 * lo verifica usando la clave secreta definida en las variables de entorno, 
 * y si es válido, adjunta el payload del usuario en `req.user`. 
 * 
 * Si el token es inválido, expirado o no se proporciona, responde con un error correspondiente.
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar el control al siguiente middleware.
 */
export const auth = (req, res, next) => {
  try {
    // Buscar el token en el header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return sendError(res, 401, "No autorizado: No se proporcionó token");
    }

    // Verificar el token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userPayload) => {
      if (err) {
        return sendError(res, 403, "No autorizado: Token inválido o expirado");
      }

      // El token es válido, adjuntamos el payload al request
      req.user = userPayload;
      next();
    });

  } catch (error) {
    return sendError(res, 500, "Error interno al validar el token");
  }
};
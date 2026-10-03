import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { authenticateUser, refreshAccessToken, logoutUser as logoutService } from "./authUserService.js";
import { validateLogin } from "./authUserValidations.js";
import { sanitizeAuthResponse } from "./authUserSanitized.js";
import config from "../../../config.js";

/**
 * Inicia sesión de un usuario.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    validateLogin({ email, password });

    const { user, accessToken, refreshToken, userPrivileges } = await authenticateUser(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const responseData = sanitizeAuthResponse(user, accessToken, userPrivileges);

    return sendSuccess(res, "Usuario logueado correctamente", responseData);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND' || error.message === 'INVALID_PASSWORD') return sendError(res, 401, "Credenciales inválidas");
    if (error.message === 'USER_INACTIVE') return sendError(res, 403, "Usuario inactivo");
    if (error.message === 'ROLE_NOT_FOUND') return sendError(res, 403, "Rol inválido");
    if (error.message === 'ROLE_INACTIVE') return sendError(res, 403, "Rol inactivo");
    if (error.message === 'USER_NO_PRIVILEGES') return sendError(res, 403, "El usuario no tiene privilegios asignados");
    return handleControllerError(res, error);
  }
};

/**
 * Refresca el token de acceso.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    const accessToken = await refreshAccessToken(refreshToken);

    return sendSuccess(res, "Token refrescado correctamente", { accessToken });

  } catch (error) {
    if (error.message.includes('REFRESH_TOKEN')) {
      return sendError(res, 401, "No autorizado: Token inválido o expirado");
    }
    if (error.message === 'USER_INACTIVE' || error.message === 'ROLE_INACTIVE' || error.message === 'ROLE_NOT_FOUND') {
      return sendError(res, 401, "No autorizado");
    }
    return handleControllerError(res, error);
  }
};

/**
 * Cierra la sesión del usuario.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 */
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    await logoutService(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax',
    });

    return sendSuccess(res, "Sesión cerrada correctamente", [], 204);
  } catch (error) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax',
    });
    return handleControllerError(res, error);
  }
};

export const authUserController = {
  loginUser,
  refreshToken,
  logoutUser
};


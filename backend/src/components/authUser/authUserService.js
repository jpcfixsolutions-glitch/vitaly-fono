import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../../../config.js";
import crypto from "crypto";

import { getCurrentDate } from "../../utils/date.js";

import { userService } from "../user/userService.js";
import { roleService } from "../role/roleService.js";
import { privilegeService } from "../privilege/privilegeService.js";
import { refreshTokenService } from "../refreshToken/refreshTokenService.js";

/**
 * Autentica un usuario validando email y contraseña, y genera tokens JWT de acceso y refresh.
 * Valida que el usuario, su rol y privilegios estén activos y almacena el refresh token.
 * 
 * @param {string} email - Email del usuario a autenticar.
 * @param {string} password - Contraseña en texto plano del usuario.
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string, userPrivileges: Object}>} 
 *   Retorna el usuario (objeto), accessToken (string), refreshToken (string), y los privilegios del usuario (objeto).
 * @throws {Error} Si alguna validación falla, retorna el mensaje específico.
 */
export const authenticateUser = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('INVALID_PASSWORD');
  }

  if (user.status !== "Activo") {
    throw new Error('USER_INACTIVE');
  }

  const userRole = await roleService.getRoleById(user.id_rol);
  if (!userRole) {
    throw new Error('ROLE_NOT_FOUND');
  }
  if (userRole.status !== "Activo") {
    throw new Error('ROLE_INACTIVE');
  }

  const userPrivileges = await privilegeService.getUserPrivileges(user.id_rol);
  if (!userPrivileges) {
    throw new Error('USER_NO_PRIVILEGES');
  }

  const payload = { 
    userId: user.id, 
    email: user.email, 
    id_rol: user.id_rol, 
    role: userRole.name, 
    name: user.name, 
    lastName: user.last_name
  };

  const accessToken = jwt.sign(payload, config.accessToken, { expiresIn: config.accessTokenExpiresIn });
  const refreshToken = jwt.sign(payload, config.refreshToken, { expiresIn: '7d' });

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await refreshTokenService.createToken({
    id_user: user.id,
    token_hashed: tokenHash,
    expires_at: expiresAt.toISOString()
  });

  await userService.updateUser(user.id, { last_login: getCurrentDate() });

  return { user, accessToken, refreshToken, userPrivileges };
};

/**
 * Genera un nuevo access token JWT válido usando el refresh token almacenado del usuario.
 * Valida la vigencia del refresh token y el estado activo del usuario.
 * 
 * @param {string} incomingRefreshToken - Token JWT de refresh recibido desde el cliente.
 * @returns {Promise<string>} - Retorna el nuevo accessToken JWT generado si todo es válido.
 * @throws {Error} Si el token falta, es inválido o expirado, o si el usuario no está activo.
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new Error('REFRESH_TOKEN_MISSING');
  }

  const tokenHash = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');

  const tokenInDb = await refreshTokenService.getTokenByHash(tokenHash);
  if (!tokenInDb) {
    throw new Error('REFRESH_TOKEN_INVALID');
  }

  if (new Date(tokenInDb.expires_at) < new Date()) {
    await refreshTokenService.deleteTokenByHash(tokenHash);
    throw new Error('REFRESH_TOKEN_EXPIRED');
  }

  const user = await userService.getUserById(tokenInDb.id_user);
  if (!user || user.status !== "Activo") {
    throw new Error('USER_INACTIVE');
  }

  const userRole = await roleService.getRoleById(user.id_rol);
  if (!userRole) {
    throw new Error('ROLE_NOT_FOUND');
  }
  if (userRole.status !== "Activo") {
    throw new Error('ROLE_INACTIVE');
  }
  
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      id_rol: user.id_rol, 
      role: userRole.name, 
      name: user.name, 
      lastName: user.last_name 
    },
    config.accessToken,
    { expiresIn: config.accessTokenExpiresIn }
  );

  return accessToken;
};

/**
 * Elimina (revoca) un refresh token de la base de datos para cerrar sesión.
 * Deja inválido el token de refresh asociado a ese usuario.
 * 
 * @param {string} incomingRefreshToken - Token de refresh JWT que se desea eliminar/revocar.
 * @returns {Promise<void>} - No retorna nada.
 */
export const logoutUser = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) return;

  const tokenHash = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');
  await refreshTokenService.deleteTokenByHash(tokenHash);
};
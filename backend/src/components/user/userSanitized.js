import { getCurrentDate } from "../../utils/date.js";
import bcrypt from "bcrypt";

/**
 * Sanitiza el objeto de usuario para enviarlo al cliente (elimina password).
 * 
 * @param {Object} user - Objeto usuario.
 * @returns {Object} Usuario sanitizado.
 */
export const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Prepara los datos para actualizar un usuario.
 * 
 * @param {Object} data - Datos recibidos.
 * @returns {Promise<Object>} Datos listos para actualizar en BD.
 */
export const prepareUpdateData = async (data) => {
  const { name, last_name, email, password, status, id_rol } = data;
  
  const dataToUpdate = {
    updated_at: getCurrentDate()
  };

  if (name) dataToUpdate.name = name;
  if (last_name) dataToUpdate.last_name = last_name;
  if (email) dataToUpdate.email = email.toLowerCase().trim();
  if (status) dataToUpdate.status = status;
  if (id_rol) dataToUpdate.id_rol = id_rol;

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  return dataToUpdate;
};


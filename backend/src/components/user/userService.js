import db from "../../database/database.js";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt";

import { v4 as uuid } from "uuid";
import { AppError } from "../../../errors.js";
import { getCurrentDate } from "../../utils/date.js";

import { user as userSchema } from "./userSchema.js";
import { role as roleSchema } from "../role/roleSchema.js";
import { calendarService } from "../calendar/calendarService.js";


const getAllUsers = async () => {
  try {
    const users = await db.select({
      id: userSchema.id,
      name: userSchema.name,
      last_name: userSchema.last_name,
      email: userSchema.email,
      id_rol: userSchema.id_rol,
      role: roleSchema.name,
      status: userSchema.status,
      last_login: userSchema.last_login, // ToDo: esta fecha no se estaría actualizando cuando el usuario inicia sesión, deberíamos controlar esto para más adelante.
      created_at: userSchema.created_at,
      updated_at: userSchema.updated_at,
    }).from(userSchema).leftJoin(roleSchema, eq(userSchema.id_rol, roleSchema.id)).all();
    return users;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los usuarios.", 500, []);
  }
}

const getUserById = async (id) => {
  try {
    const user = await db.select().from(userSchema).where(eq(userSchema.id, id)).get();
    return user;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el usuario.", 500, []);
  }
}

const getUserByEmail = async (email) => {
  try {
    const user = await db.select().from(userSchema).where(eq(userSchema.email, email)).get();
    return user;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el usuario por email.", 500, []);
  }
}

const createUser = async ({ id_rol, name, last_name, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = getCurrentDate();

    const newUser = {
      id: uuid(),
      id_rol,
      name,
      last_name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      status: "Activo",
      last_login: null,
      created_at: date,
      updated_at: date
    };

    const insertedUser = await db.insert(userSchema).values(newUser).returning().get();

    const defaultConfigurationTimetable = [{
      day: "Lunes",
      start_time: "09:00",
      end_time: "18:00",
      id_user: insertedUser.id,
      created_at: date,
      updated_at: date
    },
    {
      day: "Martes",
      start_time: "09:00",
      end_time: "18:00",
      id_user: insertedUser.id,
      created_at: date,
      updated_at: date
    },
    {
      day: "Miércoles",
      start_time: "09:00",
      end_time: "18:00",
      id_user: insertedUser.id,
      created_at: date,
      updated_at: date
    },
    {
      day: "Jueves",
      start_time: "09:00",
      end_time: "18:00",
      id_user: insertedUser.id,
      created_at: date,
      updated_at: date
    },
    {
      day: "Viernes",
      start_time: "09:00",
      end_time: "18:00",
      id_user: insertedUser.id,
      created_at: date,
      updated_at: date
    }];

    for (const configuration of defaultConfigurationTimetable) {
      await calendarService.createConfiguration(configuration);
    }

    return insertedUser;

  } catch (error) {
    throw new AppError("Ocurrió un error al registrar el usuario.", 500, []);
  }
}

const updateUser = async (id, dataUser) => {
  try {
    const updatedUser = await db.update(userSchema).set(dataUser).where(eq(userSchema.id, id)).returning().get();
    return updatedUser;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar el usuario.", 500, []);
  }
}

const deactivateUser = async (id) => {
  try {
    await db.update(userSchema).set({ status: "Inactivo" }).where(eq(userSchema.id, id));
    return;
  } catch (error) {
    throw new AppError("Ocurrió un error al dar de baja el usuario.", 500, []);
  }
}

/**
 * Obtiene los usuarios activos por id de rol
 * @param {string} id_rol - ID del rol
 * @returns {Promise<Array>} Array de usuarios activos con ese rol
 */
// ToDo: no se si esta función va acá, probablemente deba ir en roleService.
const getActiveUsersByRoleId = async (id_rol) => {
  try {
    const users = await db.select().from(userSchema).where(and(eq(userSchema.id_rol, id_rol), eq(userSchema.status, "Activo"))).all();
    return users;
  } catch (error) {
    throw new AppError("Ocurrió un error al buscar usuarios activos por rol.", 500, []);
  }
};

export const userService = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deactivateUser,
  getActiveUsersByRoleId
}
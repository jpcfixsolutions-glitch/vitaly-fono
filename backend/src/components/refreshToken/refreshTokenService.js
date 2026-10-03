import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import db from "../../database/database.js";
import { refreshTokenSchema } from "./refreshTokenSchema.js";
import { AppError } from "../../../errors.js";

const createToken = async (tokenData) => {
  try {
    const newToken = {
      id: uuid(),
      ...tokenData
    };
    const insertedToken = await db.insert(refreshTokenSchema).values(newToken).returning().get();
    return insertedToken;
  } catch (error) {
    throw new AppError("Ocurrió un error al guardar el token de refresco.", 500);
  }
};

const getTokenByHash = async (tokenHash) => {
  try {
    const token = await db.select().from(refreshTokenSchema).where(eq(refreshTokenSchema.token_hashed, tokenHash)).get();
    return token;
  } catch (error) {
    throw new AppError("Ocurrió un error al buscar el token.", 500);
  }
};

const deleteTokenByHash = async (tokenHash) => {
  try {
    await db.delete(refreshTokenSchema).where(eq(refreshTokenSchema.token_hashed, tokenHash));
    return true;
  } catch (error) {
    throw new AppError("Ocurrió un error al borrar el token.", 500);
  }
};

export const refreshTokenService = {
  createToken,
  getTokenByHash,
  deleteTokenByHash,
};
import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { schooling } from "./schoolingSchema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const getAllSchoolings = async () => {
  try {
    const schoolings = await db.select().from(schooling).all();
    return schoolings;
  } catch (error) {
    throw new AppError("Error al obtener las escolaridades", 400, []);
  }
}

const getSchoolingById = async (id) => {
  try {
    const schooling = await db.select().from(schooling).where(eq(schooling.id, id)).get();
    return schooling;
  } catch (error) {
    throw new AppError("Error al obtener la escolaridad", 400, []);
  }
}

const createSchooling = async (data) => {
  try {
    const newSchooling = {
      id: uuid(),
      ...data
    }
    const insertedSchooling = await db.insert(schooling).values(newSchooling).returning().get();
    return insertedSchooling;
  } catch (error) {
    console.error("ERROR AL CREAR ESCOLARIDAD:", error);
    throw new AppError("Error al crear la escolaridad", 400, []);
  }
}

const updateSchooling = async (id, data) => {
  try {
    const updatedSchooling = await db.update(schooling).set(data).where(eq(schooling.id, id)).returning().get();
    return updatedSchooling;
  } catch (error) {
    throw new AppError("Error al actualizar la escolaridad", 400, []);
  }
}

const getSchoolingByInterviewId = async (interviewId) => {
  try {
    const row = await db.select().from(schooling).where(eq(schooling.id_interview, interviewId)).get();
    return row;
  } catch (error) {
    throw new AppError("Error al obtener la escolaridad por entrevista", 400, []);
  }
}

const updateSchoolingByInterviewId = async (interviewId, data) => {
  try {
    const updated = await db.update(schooling).set(data).where(eq(schooling.id_interview, interviewId)).returning().get();
    return updated;
  } catch (error) {
    throw new AppError("Error al actualizar la escolaridad por entrevista", 400, []);
  }
}

const deleteSchooling = async (id) => {
  try {
    await db.delete(schooling).where(eq(schooling.id, id));
  } catch (error) {
    throw new AppError("Error al eliminar la escolaridad", 400, []);
  }
}

export const schoolingService = {
  getAllSchoolings,
  getSchoolingById,
  getSchoolingByInterviewId,
  createSchooling,
  updateSchooling,
  updateSchoolingByInterviewId,
  deleteSchooling
}

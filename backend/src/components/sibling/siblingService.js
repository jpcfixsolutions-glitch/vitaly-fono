import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { sibling } from "./siblingSchema.js"; 
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

/**
 * Devuelve todos los hermanos
 */
const getAllSiblings = async () => {
  const rows = await db.select().from(sibling).all();
  return rows;
};

/**
 * Devuelve un hermano por ID
 */
const getSiblingById = async (id) => {
  const row = await db
    .select()
    .from(sibling)
    .where(eq(sibling.id, id))
    .get();
  return row ?? null;
};

/**
 * Crea un hermano
 */
const createSibling = async (data) => {
  const toInsert = {
    id: uuid(),
    id_interview: data.id_interview,
    name: data.name,
    age: data.age,
    studies: data.studies ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  const inserted = await db.insert(sibling).values(toInsert).returning().get();
  return inserted;
};

/**
 * Actualiza un hermano por ID
 */
const updateSibling = async (id, data) => {
  const toUpdate = {};
  if (data.id_interview !== undefined) toUpdate.id_interview = data.id_interview;
  if (data.name !== undefined) toUpdate.name = data.name;
  if (data.age !== undefined) toUpdate.age = data.age;
  if (data.studies !== undefined) toUpdate.studies = data.studies;
  if (data.updated_at !== undefined) toUpdate.updated_at = data.updated_at;

  const updated = await db
    .update(sibling)
    .set(toUpdate)
    .where(eq(sibling.id, id))
    .returning()
    .get();

  return updated;
};

/**
 * Delete por ID
 */
const deleteSibling = async (id) => {
  const existing = await getSiblingById(id);
  await db.delete(sibling).where(eq(sibling.id, id)).run();
  return existing; 
};

export const siblingService = {
  getAllSiblings,
  getSiblingById,
  createSibling,
  updateSibling,
  deleteSibling,
};

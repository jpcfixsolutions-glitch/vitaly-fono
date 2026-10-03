import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { patientAdditionalInfo } from "./additionalPatientInformationSchema.js";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";

/**
 * Obtiene toda la información adicional de pacientes registrada en el sistema.
 * 
 * @async
 * @function
 * @returns {Promise<Array>} Array con todos los registros de información adicional.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getAll = async () => {
  try {
    const infoList = await db
      .select()
      .from(patientAdditionalInfo)
      .all();

    return infoList;
  } catch (error) {
    throw new AppError("Error al obtener la información adicional de los pacientes.", 500, error);
  }
};

/**
 * Obtiene la información adicional de un paciente por su id_patient.
 * 
 * @async
 * @function
 * @param {string} id_patient - ID del paciente a buscar.
 * @returns {Promise<Object|null>} Registro encontrado o null si no existe.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getByPatientId = async (id_patient) => {
  try {
    const safeId = typeof id_patient === 'string' ? id_patient.trim() : String(id_patient ?? '').trim();
    if (!safeId) {
      return null;
    }

    const foundInfo = await db
      .select()
      .from(patientAdditionalInfo)
      .where(eq(patientAdditionalInfo.id_patient, safeId))
      .get();

    return foundInfo ?? null;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener la información adicional del paciente.", 500, error);
  }
};

/**
 * Crea un nuevo registro de información adicional para un paciente.
 * 
 * @async
 * @function
 * @param {Object} dataInfo - Datos sanitizados a insertar.
 * @returns {Promise<Object>} Registro creado en la base de datos.
 * @throws {AppError} Si ocurre algún problema durante la creación.
 */
const create = async (dataInfo) => {
  try {
    const newInfo = {
      id: uuid(),
      ...dataInfo
    };

    const insertedInfo = await db
      .insert(patientAdditionalInfo)
      .values(newInfo)
      .returning()
      .get();

    return insertedInfo;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear la información adicional del paciente.", 500, error);
  }
};

/**
 * Actualiza la información adicional de un paciente existente según su id_patient.
 * 
 * @async
 * @function
 * @param {string} id_patient - ID del paciente cuya información se desea actualizar.
 * @param {Object} dataInfo - Objeto con los datos limpios a actualizar.
 * @returns {Promise<Object>} Registro actualizado.
 * @throws {AppError} Si ocurre algún problema durante la actualización.
 */
const updateByPatientId = async (id_patient, dataInfo) => {
  try {
    const updatedInfo = await db
      .update(patientAdditionalInfo)
      .set(dataInfo)
      .where(eq(patientAdditionalInfo.id_patient, id_patient))
      .returning()
      .get();

    return updatedInfo;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar la información adicional del paciente.", 400, error);
  }
};

export const additionalPatientInformationService = {
  getAll,
  getByPatientId,
  create,
  updateByPatientId
};
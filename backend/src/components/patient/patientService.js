import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { patient } from "./patientSchema.js";
import { v4 as uuid } from "uuid";
import { eq, like, and } from "drizzle-orm";
import { remove as removeAccents } from "diacritics";
import { documentType } from "../documentType/documentTypeSchema.js";
import { healthInsurance } from "../healthInsurance/healthInsuranceSchema.js";
import { session } from "../session/sessionSchema.js";
import { getCurrentDate } from "../../utils/date.js";

/**
 * Obtiene  todos los pacientes 
 * @returns {Promise<Array>} Array con todos los pacientes 
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getAllPatients = async () => {
  try {
    const patients = await db
      .select({
        id: patient.id,
        name: patient.name,
        last_name: patient.last_name,
        id_user: patient.id_user,
        birth_date: patient.birth_date,
        phone: patient.phone,
        id_health_insurance: healthInsurance.name,
        id_document_type: documentType.name,
        document_number: patient.document_number,
        email: patient.email,
        address: patient.address,
        status: patient.status,
        created_at: patient.created_at,
        updated_at: patient.updated_at,
        // last_session: session.session_date,
      })
      .from(patient)
      .leftJoin(documentType, eq(patient.id_document_type, documentType.id))
      .leftJoin(healthInsurance, eq(patient.id_health_insurance, healthInsurance.id))
      // .leftJoin(session, eq(patient.id, session.id_patient))
      .all();

    return patients;
  } catch (error) {
    throw new AppError("Error al obtener los pacientes.", 500, []);
  }
};

/**
 * Obtener un paciente por su ID
 * 
 * @param {string} id - ID del paciente a buscar
 * @returns {Promise<Object>} Paciente encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPatientById = async (id) => {
  try {
    const safeId = typeof id === 'string' ? id.trim() : String(id ?? '').trim();
    if (!safeId) {
      return null;
    }
    const foundPatient = await db.select().from(patient).where(eq(patient.id, safeId)).get();
    return foundPatient ?? null;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el paciente.", 500, []);
  }
};

/**
 * Verificar si ya existe un paciente con el mismo número de documento
 * 
 * @param {string} numero_documento - Número de documento a verificar
 * @param {string} excludeId - ID a excluir de la búsqueda (para updates)
 * @returns {Promise<Object|null>} Paciente existente o null
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPatientByDocument = async (document_number) => {
  try {
    const patientFound = await db.select().from(patient).where(eq(patient.document_number, document_number)).get();
    return patientFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el paciente por documento.", 500, []);
  }
};

/**
 * Obtiene un paciente por número de documento y tipo de documento.
 * 
 * @async
 * @function
 * @param {string} document_number - Número de documento del paciente.
 * @param {string} id_document_type - ID del tipo de documento del paciente.
 * @returns {Promise<Object|null>} Paciente encontrado o null si no existe.
 * @throws {AppError} Si ocurre un error al consultar la base de datos.
 */
const getPatientByDocumentAndDocumentType = async (document_number, id_document_type, database = db) => {
  try {
    const patientFound = await database
      .select()
      .from(patient)
      .where(and(eq(patient.document_number, document_number), eq(patient.id_document_type, id_document_type)))
      .get();
    return patientFound;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el paciente por documento y tipo de documento.", 500, []);
  }
};

/**
 * Crear un nuevo paciente
 * 
 * @param {Object} dataPatient - Datos del paciente a crear
 * @returns {Promise<Object>} Paciente creado con ID generado
 * @throws {AppError} Si ocurre algún problema durante la creación
 */
const createPatient = async (dataPatient) => {
  try {
    const newPatient = {
      id: uuid(),
      ...dataPatient
    };

    const insertedPatient = await db.insert(patient).values(newPatient).returning().get();
    return insertedPatient;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el paciente.", 500, []);
  }
};

/**
 * Actualizar datos de un paciente existente
 * 
 * @param {string} id - ID del paciente a actualizar
 * @param {Object} dataPatient - Datos a actualizar
 * @returns {Promise<Object>} Paciente actualizado
 * @throws {AppError} Si ocurre algún problema durante la actualización
 */
const updatePatient = async (id, dataPatient) => {
  try {
    const updatedPatient = await db.update(patient).set(dataPatient).where(eq(patient.id, id)).returning().get();
    return updatedPatient;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar el paciente.", 400, []);
  }
};

/**
 * Ddesactivar un paciente (borrado lógico)
 * Se marca como inactivo en lugar de borrarlo físicamente
 * 
 * @param {string} id - ID del paciente a desactivar
 * @returns {Promise<void>}
 * @throws {AppError} Si ocurre algún problema durante la desactivación
 */
const deactivatePatient = async (id) => {
  try {
    const deletedPatient = await db.update(patient).set({ status: "Inactivo", updated_at: getCurrentDate() }).where(eq(patient.id, id)).returning().get();
    return deletedPatient;
  } catch (error) {
    throw new AppError("Ocurrió un error al inactivar el paciente.", 400, []);
  }
};

/**
 * Buscar pacientes por diferentes criterios
 */
const searchPatients = async ({ name, last_name, document_number, id_document_type, status, id_user }) => {
  try {

    const filters = [];

    //Filtra por Nombre, apellido
    if (name) {
      const cleanNombre = removeAccents(name).toLowerCase();
      filters.push(like(patient.name, `%${cleanNombre}%`));
    }

    if (last_name) {
      const cleanApellido = removeAccents(last_name).toLowerCase();
      filters.push(like(patient.last_name, `%${cleanApellido}%`));
    }

    //Filtra por Estado
    if (status) {
      filters.push(eq(patient.status, status));
    }

    // Filtra por usuario (propietario del registro)
    if (id_user) {
      filters.push(eq(patient.id_user, id_user));
    }

    //Filtra por Número de documento
    if (document_number) {
      // Buscará por número Y tipo si ambos están presentes
      filters.push(eq(patient.document_number, document_number)); // El trim se hace en el controlador
      if (id_document_type) {
        filters.push(eq(patient.id_document_type, id_document_type));
      }
    }

    let query = db.select().from(patient);

    if (filters.length > 0) {
      query = query.where(and(...filters))
    }

    const patients = await query.all();

    return patients;
  } catch (error) {
    throw new AppError("Error al buscar pacientes.", 400, []);
  }
};

export const patientService = {
  getAllPatients,
  getPatientById,
  getPatientByDocument,
  createPatient,
  updatePatient,
  deactivatePatient,
  searchPatients,
  getPatientByDocumentAndDocumentType
};

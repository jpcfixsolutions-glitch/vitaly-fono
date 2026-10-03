import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { patientDischarge } from "./patientDischargeSchema.js";
import { session } from "../session/sessionSchema.js";
import { turns } from "../turn/turnSchema.js";
import { archiveAttachment } from "../archiveAttachment/archiveAttachmentSchema.js";
import { paymentHistory } from "../paymentHistory/paymentHistorySchema.js";

import { v4 as uuid } from "uuid";
import { eq, inArray } from "drizzle-orm";
import { patient } from "../patient/patientSchema.js";


const getAllPatientDischarges = async () => {
  try {
    const patientDischarges = await db.select({
      id: patientDischarge.id,
      id_patient: patientDischarge.id_patient,
      type: patientDischarge.type,
      date: patientDischarge.date,
      closing_reason: patientDischarge.closing_reason,
      created_at: patientDischarge.created_at,
      id_user: patient.id_user,
    }).from(patientDischarge).leftJoin(patient, eq(patientDischarge.id_patient, patient.id)).all();
    return patientDischarges;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los cierres de tratamiento.", 500, []);
  }
};


const getPatientDischargeById = async (id) => {
    try {
      const patientDischargeFound = await db.select().from(patientDischarge).where(eq(patientDischarge.id, id)).get();
      return patientDischargeFound;
    } catch (error) {
      throw new AppError("Ocurrió un error al obtener el cierre de tratamiento", 500, []);
    }
};

const getPatientDischargeByPatientId = async (id) => {
    try {
      const patientDischargeFound = await db.select().from(patientDischarge).where(eq(patientDischarge.id_patient, id)).get();
      return patientDischargeFound;
    } catch (error) {
      throw new AppError("Ocurrió un error al obtener el cierre de tratamiento por paciente.", 500, []);
    }
};

/**
 * Normaliza un string de fecha/hora a un objeto Date.
 * Acepta formatos como:
 * - "YYYY-MM-DD"
 * - "YYYY-MM-DD HH:MM[:SS]"
 * - "YYYY-MM-DDTHH:MM:SS"
 * Si la fecha es inválida, devuelve null.
 */
// ToDo: sacar esto y ponerlo en una util, y fijarse si realmente es necesario.
const toDateTime = (value) => {
  if (!value) return null;
  const raw = String(value).trim();

  // Si ya viene con "T" asumimos formato ISO-like
  if (raw.includes("T")) {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Si viene con espacio, lo convertimos a ISO-like
  if (raw.includes(" ")) {
    const d = new Date(raw.replace(" ", "T"));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Si solo viene fecha, asumimos 00:00:00
  const d = new Date(`${raw}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Crea un nuevo cierre de tratamiento en la base de datos
 * 
 * @param {Object} dataPatientDischarge - Datos del cierre a crear
 * @param {string} dataPatientDischarge.id_patient - ID del paciente asociado
 * @param {string} dataPatientDischarge.type - Tipo de cierre
 * @param {string} dataPatientDischarge.date - Fecha del cierre
 * @param {string} dataPatientDischarge.closing_reason - Razón del cierre
 * @param {string} dataPatientDischarge.created_at - Fecha de creación
 * @returns {Promise<Object>} El cierre creado
 * @throws {AppError} Si ocurre un error al crear el cierre
 */
const createPatientDischarge = async (dataPatientDischarge) => {
  try {
    const newPatientDischarge = {
      id: uuid(),
      ...dataPatientDischarge
    };

    const insertedPatientDischarge = await db.insert(patientDischarge).values(newPatientDischarge).returning().get();

    // ToDo: me parece que esto está mal, funciona bien pero no se si es correcto mantenerlo asi. Revisar.

    // Luego de registrar el cierre/interrupción:
    // eliminar sesiones pendientes (sin notas clínicas) y sus turnos asociados,
    // SOLO si son posteriores (o iguales) a la fecha/hora del cierre.
    // Si algo falla en esta limpieza, NO queremos romper el alta del cierre,
    // así que envolvemos esta parte en un try/catch separado.
    try {
      const patientId = dataPatientDischarge.id_patient;
      if (patientId) {
        const dischargeDate = dataPatientDischarge.date;
        const dischargeDt = toDateTime(dischargeDate);

        // 1) Obtener todas las sesiones del paciente
        const patientSessions = await db.select().from(session).where(eq(session.id_patient, patientId)).all();

        // 2) Filtrar sesiones "pendientes":
        //    - sin notas clínicas (null, vacío o solo espacios)
        //    - con fecha/hora posterior o igual al cierre (session_date >= dischargeDate)
        const sessionsToDelete = patientSessions.filter((s) => {
          const notes = (s.clinical_notes ?? "").trim();
          if (notes.length > 0) return false;

          const sessionDateStr = s.session_date || s.created_at;
          if (!sessionDateStr || !dischargeDt) return false;

          const sessionDt = toDateTime(sessionDateStr);
          if (!sessionDt) return false;

          // Comparación con precisión de fecha/hora
          return sessionDt.getTime() >= dischargeDt.getTime();
        });

        if (sessionsToDelete.length > 0) {
          const sessionIds = sessionsToDelete.map((s) => s.id);
          const turnIds = sessionsToDelete.map((s) => s.id_turn).filter((id) => !!id);

          if (sessionIds.length > 0) {
            // 3) Primero eliminar dependencias de las sesiones:
            //    - Archivos adjuntos
            await db.delete(archiveAttachment).where(inArray(archiveAttachment.id_session, sessionIds));
            //    - Historial de cobros
            await db.delete(paymentHistory).where(inArray(paymentHistory.id_session, sessionIds));
            // 4) Luego eliminar las sesiones pendientes
            await db.delete(session).where(inArray(session.id, sessionIds));
          }

            // 5) Eliminar turnos asociados a esas sesiones
            if (turnIds.length > 0) {
              await db.delete(turns).where(inArray(turns.id, turnIds));
            }
          }
        }
    } catch (cleanupError) {
      // Logueamos el error de limpieza pero no interrumpimos el flujo principal
      console.error("Error limpiando sesiones posteriores al cierre:", cleanupError);
    }

    return insertedPatientDischarge;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el cierre de tratamiento.", 400, []);
  }
};

export const patientDischargeService = {
  getAllPatientDischarges,
  getPatientDischargeById,
  getPatientDischargeByPatientId,
  createPatientDischarge,
};
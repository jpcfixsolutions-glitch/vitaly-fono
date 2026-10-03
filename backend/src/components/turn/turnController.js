import { turnService } from "./turnService.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { getCurrentDate } from "../../utils/date.js";
import { patientService } from "../patient/patientService.js";
import { sessionService } from "../session/sessionService.js";
import { turnValidations } from "./turnValidations.js";
import { turnSanitized } from "./turnSanitized.js";
import db from "../../database/database.js";
import { AppError } from "../../../errors.js";

/**
 * Obtiene todos los turnos registrados.
 * @async
 * @function
 * @param {import("express").Request} req - Objeto de solicitud Express
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const getAllTurns = async (req, res) => {
  try {
    const turns = await turnService.getAllTurns();

    if (!turns || turns.length === 0) {
      return sendError(res, 404, "No se encontraron turnos registrados", []);
    }

    return sendSuccess(res, "Turnos obtenidos correctamente", turns);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un turno por su ID.
 * @async
 * @function
 * @param {import("express").Request} req - Objeto de solicitud Express
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const getTurnById = async (req, res) => {
  try {
    const id = req.params.id;

    const turn = await turnService.getTurnById(id);

    if (!turn) {
      return sendError(res, 404, "No se encontró el turno", []);
    }

    return sendSuccess(res, "Turno obtenido correctamente", turn);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Crea un nuevo turno y asocia una sesión si corresponde.
 * @async
 * @function
 * @param {import("express").Request} req - Objeto de solicitud Express
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const createTurn = async (req, res) => {
  try {
    const { name, last_name, phone, modality, date, new_patient, id_document_type, document_number, id_user } = req.body;

    const existingPatient = await patientService.getPatientByDocument(document_number);

    await turnValidations(name, last_name, phone, modality, date, new_patient, id_document_type, document_number, id_user, existingPatient);

    const { objectSanitized } = turnSanitized(name, last_name, phone, id_document_type, document_number, modality, date, new_patient, "Programado", id_user, "create");

    const result = await turnService.createTurn(objectSanitized);

    // La sesión clínica se crea recién cuando el turno pasa a "Confirmado".
    return sendSuccess(res, "Turno creado correctamente", result, 201);

  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Actualiza el estado de un turno y gestiona la sesión asociada si corresponde.
 * @async
 * @function
 * @param {import("express").Request} req - Objeto de solicitud Express
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const updateTurn = async (req, res) => {
  try {
    const id = req.params.id;

    const exists = await turnService.getTurnById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el turno", []);
    }

    const { status } = req.body;

    const cleanUpdates = {
      updated_at: getCurrentDate(),
    };

    // ToDo: si hay errores, capaz haya que modificar lo de los estados
    if (status !== undefined) {
      const allowedStatuses = ["Programado", "Notificado", "Confirmado", "Cancelado"];
      if (!allowedStatuses.includes(status)) {
        return sendError(res, 400, "Estado no válido", []);
      }
      const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
      cleanUpdates.status = capitalizedStatus;
    } else {
      cleanUpdates.status = exists.status;
    }

    const result = await db.transaction(async (tx) => {
      const session = await sessionService.getSessionByTurnId(id, tx);

      if (session && session.status !== "Creada") {
        throw new AppError("El turno ya tiene una sesión asociada en estado '" + session.status + "'. No puede ser modificado.", 400, []);
      }

      // La sesión clínica nace cuando el paciente confirma el turno. El tipo
      // de servicio queda pendiente hasta que se registra el cobro.
      if (cleanUpdates.status === "Confirmado" && !session) {
        const patient = await patientService.getPatientByDocumentAndDocumentType(
          exists.document_number,
          exists.id_document_type,
          tx,
        );

        if (!patient) {
          throw new AppError("No se encontró el paciente asociado al turno. No se pudo crear la sesión.", 400, []);
        }

        const date = getCurrentDate();
        await sessionService.createSession({
          id_patient: patient.id,
          id_user: exists.id_user,
          id_service: null,
          id_turn: exists.id,
          session_date: exists.date,
          clinical_notes: "",
          status: "Creada",
          created_at: date,
          updated_at: date,
        }, tx);
      }

      const updatedTurn = await turnService.updateTurn(id, cleanUpdates, tx);

      // Al cancelar, eliminar únicamente una sesión que todavía no fue trabajada.
      if (cleanUpdates.status === "Cancelado" && session?.status === "Creada") {
        await sessionService.deleteSession(session.id, tx);
      }

      return updatedTurn;
    });

    return sendSuccess(res, "Turno actualizado correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Elimina un turno por su ID.
 * @async
 * @function
 * @param {import("express").Request} req - Objeto de solicitud Express
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const deleteTurn = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return sendError(res, 400, "ID del turno es requerido", []);
    }

    const exists = await turnService.getTurnById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el turno", []);
    }

    await turnService.deleteTurn(id);
    return sendSuccess(res, "Turno eliminado correctamente", []);

  } catch (error) {
    return handleControllerError(res, error);
  }
};


export const turnController = {
  getAllTurns,
  getTurnById,
  createTurn,
  updateTurn,
  deleteTurn,
};

import { sessionService } from "./sessionService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sanitizeText } from "../../utils/sanitized.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";

import { v4 as uuid } from "uuid";
import db from "../../database/database.js";
import { archiveAttachment } from "../archiveAttachment/archiveAttachmentSchema.js";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from 'cloudinary';
import config from '../../../config.js';

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
});

//Obtener todas las sesiones
const getAllSessions = async (req, res) => {
    try {
        const sessions = await sessionService.getAllSessions();

        if (!sessions || sessions.length === 0) {
            return sendError(res, 404, "No se encontraron sesiones registradas", []);
        }

        return sendSuccess(res, "Sesiones obtenidas correctamente", sessions);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

//Obtener una sesion por ID
const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await sessionService.getSessionById(id);

        if (!session) {
            return sendError(res, 404, "No se encontró la sesión buscada", []);
        }
        return sendSuccess(res, "Sesión obtenida correctamente", session);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

//Crea una nueva sesión
const createSession = async (req, res) => {
    try {
        const {
            id_patient,
            id_user,
            id_service,
            id_turn,
            session_date,
            clinical_notes, }
            = req.body;

        //Validaciones
        if (!id_patient || !id_user || !id_service || !session_date) {
            return sendError(res, 400, "Faltan datos obligatorios para crear la sesión", []);
        }
        const date = getCurrentDate();

        const sanitizedNotes = sanitizeText(clinical_notes || "", 500);

        const dataSession = {
            id_patient,
            id_user,
            id_service,
            id_turn: id_turn || null,
            session_date,
            clinical_notes: sanitizedNotes,
            status: "Activa",
            created_at: date,
            updated_at: date,
        };
        const result = await sessionService.createSession(dataSession);
        return sendSuccess(res, "Sesión creada correctamente", result, 201);
    } catch (error) {

        return handleControllerError(res, error);
    }
};


//Actualizar (editar) una sesión
const updateSession = async (req, res) => {
    try {
        const { id } = req.params;

        const existsSession = await sessionService.getSessionById(id);

        if (!existsSession) {
            return sendError(res, 404, "No se encontró la sesión", []);
        }

        const {
            id_patient,
            id_user,
            id_service,
            id_turn,
            session_date,
            clinical_notes,
            status
        } = req.body;

        const date = getCurrentDate();

        // Sanitizar notas
        const sanitizedNotes = clinical_notes !== undefined ? sanitizeText(clinical_notes, 10000) : undefined;

        // 1. Determinar cuáles van a ser las notas finales de esta sesión
        const finalNotes = sanitizedNotes !== undefined ? sanitizedNotes : existsSession.clinical_notes;

        // 2. Lógica de ESTADOS
        let finalStatus = "Creada";

        // CASO A: Prioridad PAGADA
        if (existsSession.status === "Pagada" || status === "Pagada") {
            finalStatus = "Pagada";
        }
        // CASO B: Prioridad COMPLETADA
        else if (finalNotes && finalNotes.trim().length > 0) {
            finalStatus = "Completada";
        }
        // CASO C: Si no es pagada y no tiene notas, se queda en "Creada"
        else {
            finalStatus = "Creada";
        }

        const dataSession = {
            id_patient: id_patient || existsSession.id_patient,
            id_user: id_user || existsSession.id_user,
            id_service: id_service || existsSession.id_service,
            id_turn: id_turn !== undefined ? id_turn : existsSession.id_turn,
            session_date: session_date || existsSession.session_date,
            clinical_notes: finalNotes,
            status: finalStatus,
            updated_at: date,
        };

        const result = await sessionService.updateSession(id, dataSession);

        return sendSuccess(res, "Sesión actualizada correctamente", result);
    } catch (error) {
        return handleControllerError(res, error);
    }
};


// Subir archivo a una sesión
const uploadFile = async (req, res) => {
    try {
        const { id } = req.params; // ID de la sesión

        if (!req.file) {
            return sendError(res, 400, "No se ha subido ningún archivo válido", []);
        }

        // Verificar que la sesión existe
        const existsSession = await sessionService.getSessionById(id);
        if (!existsSession) {
            return sendError(res, 404, "No se encontró la sesión", []);
        }

        // Crear el registro en la base de datos
        const newFile = {
            id: uuid(),
            id_session: id,
            filename: req.file.filename,
            original_name: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path, // URL de Cloudinary
        };

        await db.insert(archiveAttachment).values(newFile);

        // Actualizar updated_at de la sesión cuando se sube un archivo
        const date = getCurrentDate();
        await sessionService.updateSession(id, { updated_at: date });

        return sendSuccess(res, "Archivo adjuntado correctamente", newFile, 201);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

// Obtener archivos de una sesión
const getFilesBySession = async (req, res) => {
    try {
        const { id } = req.params; // ID de la sesión

        const files = await db
            .select()
            .from(archiveAttachment)
            .where(eq(archiveAttachment.id_session, id))
            .all();

        return sendSuccess(res, "Archivos obtenidos correctamente", files);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

// <-- 2. FUNCIÓN DE BORRADO AGREGADA -->
const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        // 1. Buscar archivo
        const fileRecord = await db.select().from(archiveAttachment).where(eq(archiveAttachment.id, fileId)).get();

        if (!fileRecord) {
            return sendError(res, 404, "Archivo no encontrado", []);
        }

        // 2. Obtener el ID de la sesión antes de eliminar
        const sessionId = fileRecord.id_session;

        // 3. Eliminar de Cloudinary
        if (fileRecord.path.startsWith('http')) {
            await cloudinary.uploader.destroy(fileRecord.filename);
        }

        // 4. Borrar de la BD
        await db.delete(archiveAttachment).where(eq(archiveAttachment.id, fileId));

        // 5. Actualizar updated_at de la sesión cuando se elimina un archivo
        const date = getCurrentDate();
        await sessionService.updateSession(sessionId, { updated_at: date });

        return sendSuccess(res, "Archivo eliminado correctamente", []);
    } catch (error) {
        console.error("Error en deleteFile:", error); // <--- Para ver el error real en tu terminal
        return handleControllerError(res, error);
    }
};


export const sessionController = {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,

    uploadFile,
    getFilesBySession,
    deleteFile
};

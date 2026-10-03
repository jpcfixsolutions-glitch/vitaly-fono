import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { archiveAttachmentService } from "./archiveAttachmentService.js";
import { sessionService } from "../session/sessionService.js";
import { getCurrentDate } from "../../utils/date.js";
import { v2 as cloudinary } from 'cloudinary';

/**
 * Sube un archivo a una sesión.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Request.
 * @param {import('express').Response} res - Response.
 */
const uploadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const existsSession = await sessionService.getSessionById(id);
    if (!existsSession) {
      return sendError(res, 404, "No se encontró la sesión", []);
    }

    if (!req.file) {
      return sendError(res, 400, "No se ha subido ningún archivo válido", []);
    }

    // ToDo: deberíamos sanitizar valores, aunque no son ingresados por el usuario en este caso.
    const newFile = {
      id_session: id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path, 
    };

    const createdFile = await archiveAttachmentService.createArchiveAttachment(newFile);

    // Actualizar updated_at de la sesión
    await sessionService.updateSession(id, { updated_at: getCurrentDate() });

    return sendSuccess(res, "Archivo adjuntado correctamente", createdFile, 201);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Elimina un archivo.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Request.
 * @param {import('express').Response} res - Response.
 */
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const fileRecord = await archiveAttachmentService.getArchiveAttachmentById(fileId);
    if (!fileRecord) {
      return sendError(res, 404, "Archivo no encontrado", []);
    }

    const sessionId = fileRecord.id_session;

    // Eliminar de Cloudinary (si es path http)
    if (fileRecord.path && fileRecord.path.startsWith('http')) {
      await cloudinary.uploader.destroy(fileRecord.filename);
    }

    await archiveAttachmentService.deleteArchiveAttachmentById(fileId);

    // Actualizar sesión
    await sessionService.updateSession(sessionId, { updated_at: getCurrentDate() });

    return sendSuccess(res, "Archivo eliminado correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const archiveAttachmentController = {
  uploadFile,
  deleteFile
};


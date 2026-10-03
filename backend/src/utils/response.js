import { AppError } from "../../errors.js";

export const sendSuccess = (res, message, data = [], status = 200) => {
  return res.status(status).json({ status: "success", message, data });
};

export const sendError = (res, status, message, data = []) => {
  return res.status(status).json({ status: "error", message, data });
};

export const sendFailed = (res, message = "Error interno del servidor", data = []) => {
  return res.status(500).json({ status: "failed", message, data });
};

export const handleControllerError = (res, error) => {
  if (error instanceof AppError) {
    return sendError(res, error.status, error.message, error.data);
  }
  return sendFailed(res);
};



import { sendError } from '../utils/response.js';
import { parse } from 'valibot';

export const validateSchema = (schema) => (req, res, next) => {
  try {
    const result = parse(schema, req.body);
    req.body = result;
    next();
  } catch (error) {
    return sendError(res, "Error de validación", 400, error.issues || error.message);
  }
};
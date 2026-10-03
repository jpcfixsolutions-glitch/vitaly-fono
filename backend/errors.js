/**
 * Error personalizado para errores de la aplicación.
 * 
 * @param message - El mensaje del error.
 * @param statusCode - El código de estado HTTP.
 * @param data - Los datos del error.
 */
export class AppError extends Error {
  status;
  data;
  constructor(message, statusCode = 400, data = []) {
    super(message);
    this.name = 'AppError';
    this.status = statusCode;
    this.data = data;
  }
}

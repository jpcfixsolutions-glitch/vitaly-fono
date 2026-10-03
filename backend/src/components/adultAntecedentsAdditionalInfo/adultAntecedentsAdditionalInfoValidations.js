import { AppError } from "../../../errors.js";

/**
 * Valida los datos recibidos para la entidad InformacionAdicionalAntecendentesAdultos.
 * 
 * @async
 * @function
 * @param {string} id_interview - ID de la primera entrevista (obligatorio).
 * @param {string} [pathologies_diseases] - Patologías o enfermedades actuales o previas (opcional).
 * @param {string} [medication] - Medicación actual o pasada (opcional).
 * @param {string} [substance_alcohol_consumption] - Consumo de sustancias o alcohol (opcional).
 * @param {string} [hobbies_sports] - Pasatiempos o deportes (opcional).
 * @param {string} [negative_thoughts] - Pensamientos negativos (opcional).
 * @param {string} [abuse_mistreatment] - Antecedentes de abuso o maltrato (opcional).
 * @throws {AppError} Lanza un error 400 si alguna validación falla.
 */
export const adultAntecedentsAdditionalInfoValidations = async (
  id_interview,
  pathologies_diseases,
  medication,
  substance_alcohol_consumption,
  hobbies_sports,
  negative_thoughts,
  abuse_mistreatment
) => {
  // 1. El ID de la entrevista es obligatorio para vincular la tabla con PrimeraEntrevista
  if (!id_interview || typeof id_interview !== "string" || id_interview.trim() === "") {
    throw new AppError("El ID de la entrevista es obligatorio para registrar los antecedentes", 400, []);
  }

  // 2. Validar que todos los campos opcionales, si se envían, sean cadenas de texto
  if (pathologies_diseases && typeof pathologies_diseases !== "string") {
    throw new AppError("El campo 'patologías o enfermedades' debe ser una cadena de texto válida", 400, []);
  }

  if (medication && typeof medication !== "string") {
    throw new AppError("El campo 'medicación' debe ser una cadena de texto válida", 400, []);
  }

  if (substance_alcohol_consumption && typeof substance_alcohol_consumption !== "string") {
    throw new AppError("El campo 'consumo de sustancias o alcohol' debe ser una cadena de texto válida", 400, []);
  }

  if (hobbies_sports && typeof hobbies_sports !== "string") {
    throw new AppError("El campo 'pasatiempos y deportes' debe ser una cadena de texto válida", 400, []);
  }

  if (negative_thoughts && typeof negative_thoughts !== "string") {
    throw new AppError("El campo 'pensamientos negativos' debe ser una cadena de texto válida", 400, []);
  }

  if (abuse_mistreatment && typeof abuse_mistreatment !== "string") {
    throw new AppError("El campo 'abusos o maltratos' debe ser una cadena de texto válida", 400, []);
  }
};
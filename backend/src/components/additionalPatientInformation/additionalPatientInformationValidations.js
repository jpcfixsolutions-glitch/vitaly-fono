import { isValidPhone } from "../../utils/patientUtils.js";
import { AppError } from "../../../errors.js";

/**
 * Valida los datos recibidos para la entidad InformacionAdicionalPaciente.
 * 
 * @async
 * @function
 * @param {string} id_interview - ID de la primera entrevista (obligatorio).
 * @param {string} [civil_status] - Estado civil (opcional).
 * @param {number|string} [second_phone] - Segundo teléfono de contacto (opcional).
 * @param {string} [living_with] - Con quién vive (opcional).
 * @param {string} [profession] - Profesión u oficio (opcional).
 * @param {string} [derivation] - Derivación o cómo llegó al consultorio (opcional).
 * @param {number|string} [has_had_therapy] - Si ha realizado terapia antes (opcional, 0 o 1).
 * @param {string} [therapy_duration] - Cuánto tiempo realizó terapia (opcional).
 * @param {string} [reason_for_leaving_therapy] - Motivo por el cual dejó la terapia (opcional).
 * @param {string} [current_therapy_type] - Corriente o tipo de terapia realizada (opcional).
 * @throws {AppError} Lanza un error 400 si alguna validación falla.
 */
export const additionalPatientInformationValidations = async (
  id_interview,
  civil_status,
  second_phone,
  living_with,
  profession,
  derivation,
  has_had_therapy,
  therapy_duration,
  reason_for_leaving_therapy,
  current_therapy_type
) => {
  // 1. El ID de la entrevista es el dato estrictamente obligatorio para relacionar la tabla
  if (!id_interview || typeof id_interview !== "string" || id_interview.trim() === "") {
    throw new AppError("El ID de la entrevista es obligatorio para registrar la información adicional", 400, []);
  }

  // 2. Validación del segundo teléfono (si se proporciona)
  if (second_phone !== undefined && second_phone !== null && second_phone !== "") {
    if (!isValidPhone(second_phone)) {
      throw new AppError("El segundo número de teléfono debe ser válido", 400, []);
    }
  }

  // 3. Validar que si especificó si realizó terapia, sea un valor coherente (0 para No, 1 para Sí)
  if (has_had_therapy !== undefined && has_had_therapy !== null && has_had_therapy !== "") {
    const validValues = [0, 1];
    if (!validValues.includes(Number(has_had_therapy))) {
      throw new AppError("El campo 'ha realizado terapia' debe ser 0 (No) o 1 (Sí)", 400, []);
    }
  }

  // 4. Validar coherencia: Si dice que NO realizó terapia (0), no debería haber duración, corriente ni motivo de abandono
  if (
    Number(has_had_therapy) === 0 &&
    (therapy_duration || reason_for_leaving_therapy || current_therapy_type)
  ) {
    throw new AppError(
      "Si el paciente no realizó terapia previamente (0), no debe incluir duración, corriente ni motivos de abandono",
      400,
      []
    );
  }

  if (civil_status && typeof civil_status !== "string") {
    throw new AppError("El estado civil debe ser una cadena de texto válida", 400, []);
  }

  if (living_with && typeof living_with !== "string") {
    throw new AppError("El campo 'con quién vive' debe ser una cadena de texto válida", 400, []);
  }

  if (profession && typeof profession !== "string") {
    throw new AppError("La profesión debe ser una cadena de texto válida", 400, []);
  }

  if (derivation && typeof derivation !== "string") {
    throw new AppError("La derivación debe ser una cadena de texto válida", 400, []);
  }

  if (therapy_duration && typeof therapy_duration !== "string") {
    throw new AppError("La duración de la terapia debe ser una cadena de texto válida", 400, []);
  }

  if (reason_for_leaving_therapy && typeof reason_for_leaving_therapy !== "string") {
    throw new AppError("El motivo por el cual dejó la terapia debe ser una cadena de texto válida", 400, []);
  }

  if (current_therapy_type && typeof current_therapy_type !== "string") {
    throw new AppError("La corriente de la terapia debe ser una cadena de texto válida", 400, []);
  }
};
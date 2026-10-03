import { toISOFromDateAndTime, parseInitialDateToInputs } from "./date";

/**
 * Construye el payload (datos para enviar a la API) para la creación de un turno, tomando los datos del formulario y transformando ciertos campos según lo requerido por la API.
 *
 * - Convierte la fecha y hora separadas en un string en formato ISO combinando ambos campos.
 * - Elimina el campo `time` ya que la información se consolida en `date`.
 * - Formatea el campo de modalidad para que solo la primera letra sea mayúscula y el resto minúscula.
 * - Mantiene el resto de los campos proporcionados en el formulario.
 *
 * @param {Object} formData - Datos recogidos del formulario de turno.
 * @param {string} formData.name - Nombre del paciente.
 * @param {string} formData.last_name - Apellido del paciente.
 * @param {string} formData.phone - Teléfono del paciente.
 * @param {string} formData.modality - Modalidad del turno (por ejemplo, 'presencial', 'virtual', etc.).
 * @param {string} formData.date - Fecha seleccionada en formato string (ej: "2024-01-01").
 * @param {string} formData.time - Hora seleccionada en formato string (ej: "09:00").
 * @param {boolean} [formData.new_patient] - Indica si el paciente es nuevo.
 * @returns {Object} Un objeto listo para enviar a la API con la información del turno correctamente formateada.
 */
export function buildTurnPayload(formData) {
  const iso = toISOFromDateAndTime(formData.date, formData.time);
  const toTitle = (s) => (typeof s === 'string' && s.length > 0) ? (s[0].toUpperCase() + s.slice(1).toLowerCase()) : s;
  const payload = {
    ...formData,
    date: iso,
    modality: toTitle(formData.modality),
    id_document_type: formData.id_document_type ?? formData.document_type,
    document_number: formData.document_number,
  };
  delete payload.time;
  delete payload.document_type;
  return payload;
}

/**
 * Genera los valores iniciales para el formulario de registro de turno, considerando la selección previa de fecha y hora.
 *
 * @param {Object|null} selectedDateTime - Objeto con la información de fecha y hora seleccionada, o null/undefined si no hay selección previa.
 * @param {string} selectedDateTime.date - Fecha seleccionada en formato aceptado por parseInitialDateToInputs (ej: "2024-01-01").
 * @param {string} selectedDateTime.time - Hora seleccionada en formato aceptado por parseInitialDateToInputs (ej: "09:00").
 * @returns {Object} Valores iniciales para los campos del formulario de turno.
 * @property {string} name - Inicialmente vacío.
 * @property {string} last_name - Inicialmente vacío.
 * @property {string} phone - Inicialmente vacío.
 * @property {string} document_type - Inicialmente vacío.
 * @property {string} document_number - Inicialmente vacío.
 * @property {string} modality - Inicialmente "Presencial".
 * @property {string} date - Fecha inicial (si la hay, extraída de selectedDateTime, si no, vacío).
 * @property {string} time - Hora inicial (si la hay, extraída de selectedDateTime, si no, vacío).
 * @property {boolean} new_patient - Inicialmente false.
 */
export function buildInitialValuesFromSelection(selectedDateTime) {
  const { dateInput, timeInput } = selectedDateTime
    ? parseInitialDateToInputs(selectedDateTime)
    : { dateInput: "", timeInput: "" };
  return {
    name: "",
    last_name: "",
    phone: "",
    document_type: "",
    document_number: "",
    modality: "Presencial",
    date: dateInput,
    time: timeInput,
    new_patient: false,
  };
}

/**
 * Construye el payload (datos para enviar a la API) para la creación de un paciente.
 *
 * - Toma los valores del formulario, los convierte en strings y los trimea para asegurar que no haya espacios extra.
 * - Utiliza `id_document_type` si está presente, si no recurre a `document_type`.
 * - Si un campo no está presente en los datos originales, se setea como undefined.
 *
 * @param {Object} formData - Datos recogidos del formulario de paciente.
 * @param {string} formData.name - Nombre del paciente.
 * @param {string} formData.last_name - Apellido del paciente.
 * @param {string|number} formData.id_document_type - ID del tipo de documento (puede aparecer como document_type).
 * @param {string|number} formData.document_type - ID alternativo del tipo de documento.
 * @param {string|number} formData.document_number - Número de documento.
 * @param {string|number} formData.phone - Teléfono del paciente.
 * @returns {Object} Objeto listo para enviar a la API con los datos del paciente formateados.
 */
export function buildPatientPayload(formData) {
  const payload = {
    name: formData.name ? String(formData.name).trim() : undefined,
    last_name: formData.last_name ? String(formData.last_name).trim() : undefined,
    id_document_type: formData.id_document_type ?? formData.document_type,
    document_number: formData.document_number ? String(formData.document_number).trim() : undefined,
    phone: formData.phone ? String(formData.phone).trim() : undefined,
  };
  return payload;
}

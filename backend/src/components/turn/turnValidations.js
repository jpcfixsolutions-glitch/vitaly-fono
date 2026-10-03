import { isValidDocumentNumber, isValidDocumentType, isValidNameOrLastName, isValidPhone } from "../../utils/patientUtils.js";
import { userService } from "../user/userService.js";
import { AppError } from "../../../errors.js";

export const turnValidations = async (name, last_name, phone, modality, date, new_patient, id_document_type, document_number, id_user, existingPatient) => {
  if (!name || !last_name || !phone || !modality || !date || !id_document_type || !document_number) {
    throw new AppError("Nombre, apellido, teléfono, modalidad, fecha, tipo de documento y número de documento son requeridos", 400, []);
  }

  const existsUser = await userService.getUserById(id_user);
  if (!existsUser) {
    throw new AppError("No se encontró el usuario para crear el turno", 404, []);
  }

  if ((name && !isValidNameOrLastName(name)) || (last_name && !isValidNameOrLastName(last_name))) {
    throw new AppError("El nombre y apellido debe contener solo letras, espacios, apóstrofes y guiones", 400, []);
  }

  if (phone && !isValidPhone(phone)) {
    throw new AppError("El número de teléfono debe ser válido", 400, []);
  }

  // Comparamos los datos del paciente existente con los que se están intentando registrar.
  // Si coinciden exactamente, permitimos la creación del turno incluso si new_patient es true.
  // Esto soluciona el caso donde se crea el paciente justo antes de crear el turno en la misma transacción lógica del frontend.
  const isExactMatch = existingPatient && 
    existingPatient.name === name && 
    existingPatient.last_name === last_name &&
    String(existingPatient.document_number) === String(document_number) &&
    existingPatient.id_document_type == id_document_type;

  if (document_number && (new_patient == 1) && existingPatient && !isExactMatch) {
    throw new AppError("El DNI del paciente ya está registrado.", 400, []);
  }
  
  // Si coinciden los datos, y new_patient es true, lo dejamos pasar porque asumimos que es el flujo de "crear paciente + turno"
  // y el paciente se acaba de crear hace milisegundos.

  if (existingPatient && existingPatient.name !== name && existingPatient.last_name !== last_name) {
    throw new AppError("El DNI ingresado corresponde a otro paciente ya registrado.", 400, []);
  }
  if (existingPatient && existingPatient.status !== "Activo") {
    throw new AppError("El paciente no está activo. Por favor, active el paciente antes de registrar un turno.", 400, []);
  }

  if (document_number && (new_patient == 0) && !existingPatient) {
    throw new AppError("Paciente no registrado. Marque 'Es paciente nuevo' o regístrelo.", 400, []);
  }

  if (id_document_type && !(await isValidDocumentType(id_document_type))) {
    throw new AppError("El tipo de documento debe ser válido", 400, []);
  }

  // Todo: moverlo arriba, porque si ponemos un dni inválido en el turno y despues vamos a registrar el paciente, va a fallar. pero esto no se eejecuta hasta que le demos a registrar en el form del paciente, y en este form ya no se puede editar el dni.
  if (document_number && id_document_type && !(await isValidDocumentNumber(document_number, id_document_type))) {
    throw new AppError("El número de documento debe tener un formato válido", 400, []);
  }

  const normalizedModality = String(modality).trim();
  const allowedModalities = ["Presencial", "Virtual"];
  if (!allowedModalities.includes(normalizedModality)) {
    throw new AppError("La modalidad debe ser 'Presencial' o 'Virtual'", 400, []);
  }

  const turnDate = new Date(date);
  if (isNaN(turnDate.getTime())) {
    throw new AppError("Formato de fecha inválido", 400, []);
  }
}

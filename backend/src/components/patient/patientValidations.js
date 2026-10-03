import { formatDateForDB, isValidDate } from "../../utils/date.js";
import {
  isValidDocumentNumber,
  isValidDocumentType,
  isValidEmail,
  isValidHealthInsurance,
  isValidNameOrLastName,
  isValidPhone,
} from "../../utils/patientUtils.js";
import { patientService } from "./patientService.js";
import { AppError } from "../../../errors.js";

export const patientValidations = async (name, last_name, id_document_type, document_number, phone, birth_date, email, address, id_health_insurance, id_user) => {
  if (!name || !last_name || !phone || !id_document_type || !document_number) {
    throw new AppError("Los campos nombre, apellido, teléfono, tipo de documento y número de documento son obligatorios", 400, []);
  }

  if ((name && !isValidNameOrLastName(name)) || (last_name && !isValidNameOrLastName(last_name))) {
    throw new AppError("El nombre y apellido debe contener solo letras, espacios, apóstrofes y guiones", 400, []);
  }

  if (birth_date && !isValidDate(birth_date)) {
    throw new AppError("La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)", 400, []);
  }

  if (birth_date && new Date(formatDateForDB(birth_date)) > new Date()) {
    throw new AppError("La fecha de nacimiento no puede ser mayor a la fecha actual", 400, []);
  }

  if (phone && !isValidPhone(phone)) {
    throw new AppError("El número de teléfono debe ser válido", 400, []);
  }

  if (email && !isValidEmail(email)) {
    throw new AppError("El email debe tener un formato válido", 400, []);
  }

  if (id_document_type && !(await isValidDocumentType(id_document_type))) {
    throw new AppError("El tipo de documento debe ser válido", 400, []);
  }

  if (document_number && id_document_type && !(await isValidDocumentNumber(document_number, id_document_type))) {
    throw new AppError("El número de documento debe tener un formato válido", 400, []);
  }

  if (id_health_insurance && !(await isValidHealthInsurance(id_health_insurance))) {
    throw new AppError("La obra social debe ser válida", 400, []);
  }

  const existingPatient = await patientService.getPatientByDocument(document_number);
  if (existingPatient && existingPatient.id_user === id_user) {
    throw new AppError("Ya existe un paciente registrado con este número de documento", 400, []);
  }
}
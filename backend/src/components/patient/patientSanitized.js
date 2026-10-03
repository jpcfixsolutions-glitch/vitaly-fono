import { formatDateForDB, getCurrentDate } from "../../utils/date.js";

export const patientSanitized = (name, last_name, id_document_type, document_number, phone, birth_date, email, address, id_health_insurance, id_user, mode = "create") => {
  let objectSanitized = {};

  if (mode === "create") {
    objectSanitized = {
      name,
      last_name,
      id_document_type,
      document_number,
      phone: parseInt(phone),
      birth_date: birth_date ? formatDateForDB(birth_date) : '',
      id_health_insurance: id_health_insurance ? id_health_insurance : null,
      status: "Activo",
      email: email ? email.toLowerCase().trim() : '',
      address: address ? address.trim() : '',
      id_user,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }
  }
  else if (mode === "update") {
    objectSanitized = {
      name: name.trim(),
      last_name: last_name.trim(),
      id_document_type,
      document_number: document_number.trim(),
      phone: parseInt(phone),
      birth_date: birth_date ? formatDateForDB(birth_date) : '',
      id_health_insurance: id_health_insurance ? id_health_insurance : null,
      email: email ? email.toLowerCase().trim() : '',
      address: address ? address.trim() : '',
      id_user,
      updated_at: getCurrentDate(),
    }
  }
  return {
    objectSanitized,
  }
}
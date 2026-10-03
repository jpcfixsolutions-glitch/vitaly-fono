import { getCurrentDate } from "../../utils/date.js";

export const turnSanitized = (name, last_name, phone, id_document_type, document_number, modality, date, new_patient, status = "Programado", id_user, mode = "create") => {
  let objectSanitized = {};

  if (mode === "create") {
    objectSanitized = {
      name,
      last_name,
      phone: parseInt(phone),
      id_document_type,
      document_number: document_number.toString(),
      modality,
      date: String(date).trim(),
      new_patient: new_patient ? 1 : 0,
      status,
      id_user: id_user,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }
  }
  else if (mode === "update") {
    objectSanitized = {
      name,
      last_name,
      phone,
      modality,
      date,
      new_patient,
      id_document_type,
      document_number,
      status,
      id_user,
      updated_at: getCurrentDate(),
    }
  }
  return { objectSanitized };
}
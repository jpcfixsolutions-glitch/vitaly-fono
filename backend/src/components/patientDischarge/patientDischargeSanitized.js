import { getCurrentDate } from "../../utils/date.js";

export const patientDischargeSanitized = (id_patient, type, closing_reason) => {
  const objectSanitized = {
    id_patient,
    type,
    closing_reason,
    date: getCurrentDate(),
    created_at: getCurrentDate(),
  };

  return { objectSanitized };
};
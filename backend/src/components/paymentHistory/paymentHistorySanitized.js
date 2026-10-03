import { getCurrentDate } from "../../utils/date.js";

export const paymentHistorySanitized = (id_session, id_patient, id_health_insurance, id_payment_method, id_service, amount, notes, id_user) => {
  let objectSanitized = {
    id_session,
    id_patient,
    id_health_insurance,
    id_payment_method,
    id_service,
    id_user,
    amount,
    notes,
    created_at: getCurrentDate(),
    updated_at: getCurrentDate(),
    paid_at: getCurrentDate(),
    status: "Pagada",
  }
  
  return { objectSanitized };
}
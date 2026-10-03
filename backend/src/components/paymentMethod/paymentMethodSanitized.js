import { getCurrentDate } from "../../utils/date.js";

export const paymentMethodSanitized = (name, id_user, mode = "create") => {
  let objectSanitized = {};
  if (mode === "create") {
    objectSanitized = {
      name,
      id_user,
      status: "Activo",
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }
  }
  else if (mode === "update") {
    objectSanitized = {
      name,
      id_user,
      status: "Activo",
      updated_at: getCurrentDate(),
    }
  }
  return { objectSanitized };
}
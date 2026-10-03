import { getCurrentDate } from "../../utils/date.js";

export const cohabitantSanitized = (id_interview, domestic_cohabitation, non_domestic_cohabitation, mode = "create") => {
  let objectSanitized = {};
  
  if (mode === "create") {
    objectSanitized = {
      id_interview,
      domestic_cohabitation,
      non_domestic_cohabitation,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate()
    }
  }
  else if (mode === "update") {
    objectSanitized = {
      id_interview,
      domestic_cohabitation,
      non_domestic_cohabitation,
      updated_at: getCurrentDate()
    }
  }

  return { objectSanitized }; 
}
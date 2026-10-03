import { getCurrentDate } from "../../utils/date.js";

export const calendarSanitized = (day, start_time, end_time, id_user, mode = "create") => {
  let objectSanitized = {};
  
  if (mode === "create") {
    objectSanitized = {
      day,
      start_time,
      end_time,
      id_user,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate()
    }
  } else if (mode === "update") {
    objectSanitized = {
      day,
      start_time,
      end_time,
      id_user,
      updated_at: getCurrentDate()
    }
  }

  return { objectSanitized };
}
import { getCurrentDate } from "../../utils/date.js";

export const fatherSanitized = (id_interview, father_name, father_age, father_lives, father_profession, father_work_hours, mode = "create") => {
  let objectSanitized = {};

  if (mode === "create") {
    objectSanitized = {
      id_interview,
      father_name,
      father_age,
      father_lives: father_lives ? 1 : 0,
      father_profession,
      father_work_hours,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }
  }
  else if (mode === "update") {
    objectSanitized = {
      id_interview,
      father_name,
      father_age,
      father_lives,
      father_profession,
      father_work_hours,
      updated_at: getCurrentDate(),
    }
  }

  return { objectSanitized };
}
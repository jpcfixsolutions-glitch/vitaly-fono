import { getCurrentDate } from "../../utils/date.js";

/**
 * Sanitiza los datos de una madre para crear o actualizar.
 * 
 * @param {string} id_interview
 * @param {string} mother_name
 * @param {string|number} mother_age
 * @param {boolean|number} mother_lives
 * @param {string} mother_profession
 * @param {string} mother_work_hours
 * @param {string} mode - 'create' o 'update'
 * @returns {Object} Objeto con propiedad objectSanitized.
 */
export const motherSanitized = (id_interview, mother_name, mother_age, mother_lives, mother_profession, mother_work_hours, mode = "create") => {
  let objectSanitized = {};

  if (mode === "create") {
    objectSanitized = {
      id_interview,
      mother_name,
      mother_age: mother+age ? String(mother_age) : mother_age,
      mother_lives: mother_lives ? 1 : 0,
      mother_profession,
      mother_work_hours,
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    }
  }
  else if (mode === "update") {
    objectSanitized = {
      id_interview,
      mother_name,
      mother_age: mother+age ? String(mother_age) : mother_age,
      mother_lives: mother_lives ? 1 : 0,
      mother_profession,
      mother_work_hours,
      updated_at: getCurrentDate(),
    };
  }

  return { objectSanitized };
};


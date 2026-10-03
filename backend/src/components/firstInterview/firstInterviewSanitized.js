import { getCurrentDate } from "../../utils/date.js";

export const firstInterviewSanitized = (
  id_patient, 
  id_user, 
  family_dynamics, 
  perinatal_history, 
  general_development, 
  diseases_allergies, 
  family_pathology_history, 
  personality_description, 
  reason_for_consultation, 
  genogram, 
  mode = "create"
) => {
  let objectSanitized = {};

  // Sanitizar los campos string para evitar SQL injection
  function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    // Elimina ';', '--', comentarios, y reemplaza comillas simples y dobles
    return str
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*.*?\*\//gs, '')
      .replace(/['"]/g, '')
      .trim();
  }

  family_dynamics = sanitizeString(family_dynamics);
  perinatal_history = sanitizeString(perinatal_history);
  general_development = sanitizeString(general_development);
  diseases_allergies = sanitizeString(diseases_allergies);
  family_pathology_history = sanitizeString(family_pathology_history);
  personality_description = sanitizeString(personality_description);
  reason_for_consultation = sanitizeString(reason_for_consultation);
  genogram = sanitizeString(genogram);

  if (mode === "create") {
    objectSanitized = {
      id_patient,
      id_user,
      family_dynamics,
      perinatal_history,
      general_development,
      diseases_allergies,
      family_pathology_history,
      personality_description,
      reason_for_consultation,
      genogram,
      date: getCurrentDate(),
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    };
  }
  else if (mode === "update") {
    objectSanitized = {
      id_patient,
      id_user,
      family_dynamics,
      perinatal_history,
      general_development,
      diseases_allergies,
      family_pathology_history,
      personality_description,
      reason_for_consultation,
      genogram,
      updated_at: getCurrentDate(),
    };
  }

  return { objectSanitized };
}
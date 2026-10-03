import { getCurrentDate } from "../../utils/date.js";

/**
 * Sanitiza los datos de entrada para la entidad InformacionAdicionalAntecendentesAdultos.
 * 
 * @param {string} id_interview - ID de la entrevista (solo relevante en modo 'create').
 * @param {string} [pathologies_diseases] - Patologías o enfermedades actuales o previas.
 * @param {string} [medication] - Medicación actual o pasada.
 * @param {string} [substance_alcohol_consumption] - Consumo de sustancias o alcohol.
 * @param {string} [hobbies_sports] - Pasatiempos o deportes que practica.
 * @param {string} [negative_thoughts] - Presencia o descripción de pensamientos negativos.
 * @param {string} [abuse_mistreatment] - Antecedentes de abuso o maltrato.
 * @param {string} [mode="create"] - Modo de operación: "create" o "update".
 * @returns {{ objectSanitized: Object }} Objeto sanitizado listo para la base de datos.
 */
export const adultAntecedentsAdditionalInfoSanitized = (
  id_interview,
  pathologies_diseases,
  medication,
  substance_alcohol_consumption,
  hobbies_sports,
  negative_thoughts,
  abuse_mistreatment,
  mode = "create"
) => {
  let objectSanitized = {};

  if (mode === "create") {
    objectSanitized = {
      id_interview: id_interview || null,
      pathologies_diseases: pathologies_diseases ? pathologies_diseases.trim() : '',
      medication: medication ? medication.trim() : '',
      substance_alcohol_consumption: substance_alcohol_consumption ? substance_alcohol_consumption.trim() : '',
      hobbies_sports: hobbies_sports ? hobbies_sports.trim() : '',
      negative_thoughts: negative_thoughts ? negative_thoughts.trim() : '',
      abuse_mistreatment: abuse_mistreatment ? abuse_mistreatment.trim() : '',
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    };
  } else if (mode === "update") {
    objectSanitized = {
      pathologies_diseases: pathologies_diseases ? pathologies_diseases.trim() : '',
      medication: medication ? medication.trim() : '',
      substance_alcohol_consumption: substance_alcohol_consumption ? substance_alcohol_consumption.trim() : '',
      hobbies_sports: hobbies_sports ? hobbies_sports.trim() : '',
      negative_thoughts: negative_thoughts ? negative_thoughts.trim() : '',
      abuse_mistreatment: abuse_mistreatment ? abuse_mistreatment.trim() : '',
      updated_at: getCurrentDate(),
    };
  }

  return {
    objectSanitized,
  };
};
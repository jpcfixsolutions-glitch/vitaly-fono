import { getCurrentDate } from "../../utils/date.js";

export const additionalPatientInformationSanitized = (
  id_interview,
  civil_status,
  second_phone,
  living_with,
  profession,
  derivation,
  has_had_therapy,
  therapy_duration,
  reason_for_leaving_therapy,
  current_therapy_type,
  mode = "create"
) => {
  let objectSanitized = {};

  if (mode === "create") {
    objectSanitized = {
      id_interview: id_interview || null,
      civil_status: civil_status ? civil_status.trim() : '',
      second_phone: second_phone ? parseInt(second_phone, 10) : null,
      living_with: living_with ? living_with.trim() : '',
      profession: profession ? profession.trim() : '',
      derivation: derivation ? derivation.trim() : '',
      has_had_therapy: has_had_therapy !== undefined && has_had_therapy !== null 
        ? parseInt(has_had_therapy, 10) 
        : 0,
      therapy_duration: therapy_duration ? therapy_duration.trim() : '',
      reason_for_leaving_therapy: reason_for_leaving_therapy ? reason_for_leaving_therapy.trim() : '',
      current_therapy_type: current_therapy_type ? current_therapy_type.trim() : '',
      created_at: getCurrentDate(),
      updated_at: getCurrentDate(),
    };
  } else if (mode === "update") {
    objectSanitized = {
      civil_status: civil_status ? civil_status.trim() : '',
      second_phone: second_phone ? parseInt(second_phone, 10) : null,
      living_with: living_with ? living_with.trim() : '',
      profession: profession ? profession.trim() : '',
      derivation: derivation ? derivation.trim() : '',
      has_had_therapy: has_had_therapy !== undefined && has_had_therapy !== null 
        ? parseInt(has_had_therapy, 10) 
        : 0,
      therapy_duration: therapy_duration ? therapy_duration.trim() : '',
      reason_for_leaving_therapy: reason_for_leaving_therapy ? reason_for_leaving_therapy.trim() : '',
      current_therapy_type: current_therapy_type ? current_therapy_type.trim() : '',
      updated_at: getCurrentDate(),
    };
  }

  return {
    objectSanitized,
  };
};
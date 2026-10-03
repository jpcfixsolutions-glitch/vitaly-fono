import { calculateAge } from '../../../utils/age';
import { parseDate, toInputDate } from '../../../utils/date';

/**
 * Mapea los datos de la entrevista y el paciente a un formato que coincida con los campos del formulario
 * para poder mostrarlos en modo solo lectura
 * 
 * @param {Object} interview - Objeto con los datos de la entrevista
 * @param {Object} patient - Objeto con los datos del paciente
 * @returns {Object} Objeto con los datos mapeados para visualización
 */
export const mapInterviewToViewData = (interview, patient) => {
  if (!interview) return {};

  const patientAdditionalInfo = interview?.patientAdditionalInfo || interview?.additional_patient_information || interview?.additionalInfo || interview?.patientAdditionalInformation || {};
  const adultAdditionalAntecedents = interview?.adult_antecedents_additional_info || interview?.adultAntecedentsAdditionalInfo || interview?.adultAntecedents || {};

  // Datos personales
  const complete_name = interview?.patient?.name + " " + interview?.patient?.last_name || '';
  const birth_date = parseDate(interview?.patient?.birth_date).dateParsed || '';
  const age = birth_date ? calculateAge(birth_date) : '';
  const address = interview?.patient?.address || '';
  const phone = interview?.patient?.phone || '';
  const civil_status = patientAdditionalInfo?.civil_status || '';
  const second_phone = patientAdditionalInfo?.second_phone || '';
  const living_with = patientAdditionalInfo?.living_with || interview?.cohabitation?.domestic_cohabitation || '';
  const profession = patientAdditionalInfo?.profession || '';
  const derivation = patientAdditionalInfo?.derivation || '';
  const has_had_therapy = patientAdditionalInfo?.has_had_therapy ?? '';
  const therapy_duration = patientAdditionalInfo?.therapy_duration || '';
  const reason_for_leaving_therapy = patientAdditionalInfo?.reason_for_leaving_therapy || '';
  const current_therapy_type = patientAdditionalInfo?.current_therapy_type || '';
  const domestic_cohabitation = interview?.cohabitation?.domestic_cohabitation || '';
  const non_domestic_cohabitation = interview?.cohabitation?.non_domestic_cohabitation || '';

  // Datos familiares - Padre
  const father_name = interview?.family?.father?.father_name || '';
  const father_age = interview?.family?.father?.father_age || '';
  const father_lives = interview?.family?.father?.father_lives;
  const father_profession = interview?.family?.father?.father_profession || '';
  const father_work_hours = interview?.family?.father?.father_work_hours || '';

  // Datos familiares - Madre
  const mother_name = interview?.family?.mother?.mother_name || '';
  const mother_age = interview?.family?.mother?.mother_age || '';
  const mother_lives = interview?.family?.mother?.mother_lives;
  const mother_profession = interview?.family?.mother?.mother_profession || '';
  const mother_work_hours = interview?.family?.mother?.mother_work_hours || '';

  // Hermanos
  const siblings = interview?.family?.siblings || [];
  // const genogram = interview?.interview?.genogram || '';
  const family_dynamics = interview?.interview?.family_dynamics || '';

  // Antecedentes
  const perinatal_history = interview?.interview?.perinatal_history || '';
  const general_development = interview?.interview?.general_development || '';
  const diseases_allergies = interview?.interview?.diseases_allergies || '';
  const family_pathology_history = interview?.interview?.family_pathology_history || adultAdditionalAntecedents?.family_pathology_history || '';
  const pathologies_diseases = adultAdditionalAntecedents?.pathologies_diseases || '';
  const medication = adultAdditionalAntecedents?.medication || '';
  const substance_alcohol_consumption = adultAdditionalAntecedents?.substance_alcohol_consumption || '';
  const hobbies_sports = adultAdditionalAntecedents?.hobbies_sports || '';
  const genogram = interview?.interview?.genogram || adultAdditionalAntecedents?.genogram || '';
  const negative_thoughts = adultAdditionalAntecedents?.negative_thoughts || '';
  const abuse_mistreatment = adultAdditionalAntecedents?.abuse_mistreatment || '';
  const reason_for_consultation = interview?.interview?.reason_for_consultation || adultAdditionalAntecedents?.reason_for_consultation || '';
  
  // Escolarización
  const schooling_year = interview?.schooling?.schooling_year || '';
  const current_course = interview?.schooling?.current_course || '';
  const school_name = interview?.schooling?.school_name || '';
  const orientation = interview?.schooling?.orientation || '';
  const repeat_course = interview?.schooling?.repeat_course || '';
  const repeat_course_reason = interview?.schooling?.repeat_course_reason ?? '';
  const school_changes = interview?.schooling?.school_changes || '';
  const school_changes_reason = interview?.schooling?.school_changes_reason ?? '';
  
  const initial_level = interview?.schooling?.initial_level || '';
  const primary_level = interview?.schooling?.primary_level || '';
  const secondary_level = interview?.schooling?.secondary_level || '';
  const general_remarks = interview?.schooling?.general_remarks || '';

  // Aspectos psicológicos
  const personality_description = interview?.interview?.personality_description || '';
  // const reason_for_consultation = interview?.interview?.reason_for_consultation || '';

  return {
    // Datos personales
    complete_name,
    birth_date,
    age,
    address,
    phone,
    civil_status,
    second_phone,
    living_with,
    profession,
    derivation,
    has_had_therapy,
    therapy_duration,
    reason_for_leaving_therapy,
    current_therapy_type,
    domestic_cohabitation,
    
    // Datos familiares - Padre
    father_name,
    father_age,
    father_lives,
    father_profession,
    father_work_hours,
    
    // Datos familiares - Madre
    mother_name,
    mother_age,
    mother_lives,
    mother_profession,
    mother_work_hours,
    
    // Hermanos
    siblings: Array.isArray(siblings) ? siblings : [],
    
    // Datos familiares extra
    non_domestic_cohabitation,
    genogram,
    family_dynamics,
    
    // Antecedentes
    perinatal_history,
    general_development,
    diseases_allergies,
    family_pathology_history,
    pathologies_diseases,
    medication,
    substance_alcohol_consumption,
    hobbies_sports,
    // genogram,
    negative_thoughts,
    abuse_mistreatment,
    // reason_for_consultation,
    
    // Escolarización
    schooling_year,
    current_course,
    school_name,
    orientation,
    repeat_course,
    repeat_course_reason,
    school_changes,
    school_changes_reason,
    initial_level,
    primary_level,
    secondary_level,
    general_remarks,
    
    // Aspectos psicológicos
    personality_description,
    reason_for_consultation,
  };
};

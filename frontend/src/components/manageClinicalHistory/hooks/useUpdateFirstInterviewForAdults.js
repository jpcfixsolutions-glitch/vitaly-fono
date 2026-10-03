import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const useUpdateFirstInterviewForAdults = () => {
  const { trigger, loading, error } = useApi({
    method: 'PUT',
    url: '/primeras-entrevistas',
  });

  const updateFirstInterviewForAdults = async (id_interview, formData, id_patient) => {
    try {
      const sanitizedData = {
        id_patient: id_patient || undefined,
        id_user: getUser().id || undefined,
        patient: {
          adult: true,
          birth_date: formData?.birth_date || undefined,
          address: formData?.address || undefined,
          civil_status: formData?.civil_status || undefined,
          occupation: formData?.occupation || undefined,
          education_level: formData?.education_level || undefined,
          phone: formData?.phone || undefined,
          second_phone: formData?.second_phone || undefined,
          living_with: formData?.living_with || undefined,
          profession: formData?.profession || undefined,
          derivation: formData?.derivation || undefined,
          has_had_therapy: formData?.has_had_therapy ?? undefined,
          therapy_duration: formData?.therapy_duration || undefined,
          reason_for_leaving_therapy: formData?.reason_for_leaving_therapy || undefined,
          current_therapy_type: formData?.current_therapy_type || undefined,
        },
        interview: {
          // family_dynamics: formData?.family_dynamics || undefined,
          // perinatal_history: formData?.perinatal_history || undefined,
          // general_development: formData?.general_development || undefined,
          // diseases_allergies: formData?.diseases_allergies || undefined,
          family_pathology_history: formData?.family_pathology_history || undefined,
          // personality_description: formData?.personality_description || undefined,
          reason_for_consultation: formData?.reason_for_consultation || undefined,
          genogram: formData?.genogram || undefined,
          // date: formData?.date || undefined,
        },
        adultAntecedentsAdditionalInfo: {
          pathologies_diseases: formData?.pathologies_diseases || undefined,
          medication: formData?.medication || undefined,
          substance_alcohol_consumption: formData?.substance_alcohol_consumption || undefined,
          hobbies_sports: formData?.hobbies_sports || undefined,
          negative_thoughts: formData?.negative_thoughts || undefined,
          abuse_mistreatment: formData?.abuse_mistreatment || undefined,
        }
        // family: {
        //   father: {
        //     father_name: formData?.father_name || undefined,
        //     father_age: formData?.father_age || undefined,
        //     father_lives: formData?.father_lives ?? undefined,
        //     father_profession: formData?.father_profession || undefined,
        //     father_work_hours: formData?.father_work_hours || undefined,
        //   },
        //   mother: {
        //     mother_name: formData?.mother_name || undefined,
        //     mother_age: formData?.mother_age || undefined,
        //     mother_lives: formData?.mother_lives ?? undefined,
        //     mother_profession: formData?.mother_profession || undefined,
        //     mother_work_hours: formData?.mother_work_hours || undefined,
        //   },
        //   siblings: formData?.siblings || undefined,
        // },
        // cohabitants: {
        //   domestic_cohabitation: formData?.domestic_cohabitation || undefined,
        //   non_domestic_cohabitation: formData?.non_domestic_cohabitation || undefined,
        // },
        // schooling: {
        //   schooling_year: formData?.schooling_year || undefined,
        //   current_course: formData?.current_course || undefined,
        //   school_name: formData?.school_name || undefined,
        //   orientation: formData?.orientation || undefined,
        //   repeat_course: formData?.repeat_course ?? undefined,
        //   repeat_course_reason: formData?.repeat_course_reason || undefined,
        //   school_changes: formData?.school_changes ?? undefined,
        //   school_changes_reason: formData?.school_changes_reason || undefined,
        //   initial_level: formData?.initial_level || undefined,
        //   primary_level: formData?.primary_level || undefined,
        //   secondary_level: formData?.secondary_level || undefined,
        //   general_remarks: formData?.general_remarks || undefined,
        // }
      };

      const response = await trigger(sanitizedData, id_interview);
      return response;
    } catch (error) {
      console.error("Error al actualizar la primera entrevista:", error);
      throw error;
    }
  };

  return { updateFirstInterviewForAdults, loading, error };
};

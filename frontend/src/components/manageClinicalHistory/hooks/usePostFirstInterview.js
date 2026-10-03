import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const usePostFirstInterview = () => {
  const { trigger, loading, error } = useApi({
    url: '/primeras-entrevistas',
    method: 'POST',
  });

  // En la primera version recibiamos un payload y en el trigger metiamos directamente el payload.
  const postFirstInterview = async (formData, id_patient) => {
    try {
      // Construir payload consistente con el backend
      const sanitizedData = {
        id_patient: id_patient || undefined,
        id_user: getUser().id || undefined,
        patient: {
          birth_date: formData?.birth_date || undefined,
          address: formData?.address || undefined,
          phone: formData?.phone || undefined,
        },
        interview: {
          family_dynamics: formData?.family_dynamics || undefined,
          perinatal_history: formData?.perinatal_history || undefined,
          general_development: formData?.general_development || undefined,
          diseases_allergies: formData?.diseases_allergies || undefined,
          family_pathology_history: formData?.family_pathology_history || undefined,
          personality_description: formData?.personality_description || undefined,
          reason_for_consultation: formData?.reason_for_consultation || undefined,
          genogram: formData?.genogram || undefined,
        },
        family: {
          father: {
            father_name: formData?.father_name || undefined,
            father_age: formData?.father_age || undefined,
            father_lives: formData?.father_lives || undefined,
            father_profession: formData?.father_profession || undefined,
            father_work_hours: formData?.father_work_hours || undefined,
          },
          mother: {
            mother_name: formData?.mother_name || undefined,
            mother_age: formData?.mother_age || undefined,
            mother_lives: formData?.mother_lives || undefined,
            mother_profession: formData?.mother_profession || undefined,
            mother_work_hours: formData?.mother_work_hours || undefined,
          },
          siblings: formData?.siblings || undefined,
        },
        cohabitants: {
          domestic_cohabitation: formData?.domestic_cohabitation || undefined,
          non_domestic_cohabitation: formData?.non_domestic_cohabitation || undefined,
        },
        schooling: {
          schooling_year: formData?.schooling_year || undefined,
          current_course: formData?.current_course || undefined,
          school_name: formData?.school_name || undefined,
          orientation: formData?.orientation || undefined,
          repeat_course: formData?.repeat_course || undefined,
          repeat_course_reason: formData?.repeat_course_reason || undefined,
          school_changes: formData?.school_changes || undefined,
          school_changes_reason: formData?.school_changes_reason || undefined,
          initial_level: formData?.initial_level || undefined,
          primary_level: formData?.primary_level || undefined,
          secondary_level: formData?.secondary_level || undefined,
          general_remarks: formData?.general_remarks || undefined,
        }
      };

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al crear la primera entrevista:", error);
      throw error;
    }
  };

  return { postFirstInterview, loading, error };
};






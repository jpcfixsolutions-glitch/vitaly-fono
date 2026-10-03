import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const usePostSession = () => {
  const { trigger, loading, error } = useApi({
    url: '/sesion',
    method: 'POST',
  });

  const postSession = async (formData, id_patient) => {
    try {
      const payload = {
        id_patient: id_patient,
        id_user: getUser().id,
        session_date: formData.session_date,
        clinical_notes: formData.clinical_notes,
        status: formData.status || "Creada",
      };

      const response = await trigger(payload);
      return response;
    } catch (error) {
      console.error("Error al crear la sesión:", error);
      throw error;
    }
  };

  return { postSession, loading, error };
};

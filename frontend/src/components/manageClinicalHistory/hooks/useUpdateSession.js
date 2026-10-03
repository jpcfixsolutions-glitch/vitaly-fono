import { useApi } from "../../../hooks";
import { getUser } from "../../../utils/getUser";

export const useUpdateSession = () => {
  const { trigger, loading, error } = useApi({
    method: 'PATCH',
    url: '/sesion',
  });

  const updateSession = async (id_session, formData, id_patient) => {
    try {
      const payload = {
        id_patient: id_patient,
        id_user: getUser().id,
        session_date: formData.session_date,
        clinical_notes: formData.clinical_notes,
        status: formData.status,
      };

      const response = await trigger(payload, id_session);
      return response;
    } catch (error) {
      console.error("Error al actualizar la sesión:", error);
      throw error;
    }
  };

  return { updateSession, loading, error };
};

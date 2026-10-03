import { useApi } from "../../../hooks"
import { getUser } from "../../../utils/getUser"

export const usePostTurns = () => {
  const { trigger, loading, error } = useApi({
    url: "/turnos",
    method: "POST",
  });

  const postTurn = async (formData) => {
    const sanitized = {
      ...formData,
      name: typeof formData?.name === 'string' ? formData.name.trim() : (formData?.name ?? ''),
      last_name: typeof formData?.last_name === 'string' ? formData.last_name.trim() : (formData?.last_name ?? ''),
      phone: String(formData?.phone ?? '').trim(),
      modality: typeof formData?.modality === 'string' ? formData.modality.trim() : (formData?.modality ?? ''),
      date: typeof formData?.date === 'string' ? formData.date.trim() : (formData?.date ?? ''),
      id_document_type: (formData?.id_document_type ?? formData?.id_document_type) || '',
      document_number: String(formData?.document_number ?? '').trim(),
      new_patient: !!formData?.new_patient,
      id_user: formData?.id_user || getUser().id || undefined,
    }

    const response = await trigger(sanitized);
    return response;
  }

  return { postTurn, loading, error };
}
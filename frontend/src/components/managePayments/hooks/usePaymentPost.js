import { useApi } from '../../../hooks';
import { getUser } from '../../../utils/getUser';

export const usePaymentPost = () => {
  const { trigger, loading, error } = useApi({
    url: '/historial-cobro',
    method: 'POST',
  });

  const postPayment = async (formData) => {
    try {
      const sanitizedData = {
        amount: formData?.amount ? Number(formData.amount) : undefined,
        paid_at: formData?.paid_at ? String(formData.paid_at).trim() : undefined,
        id_session: formData?.id_session || undefined,
        id_patient: formData?.id_patient || formData?.meta?.patientId || undefined,
        id_health_insurance: formData?.id_health_insurance || undefined,
        id_payment_method: formData?.id_payment_method || undefined,
        id_service: formData?.id_service || undefined,
        id_user: getUser().id || undefined,
        notes: formData?.notes || undefined,
      };

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al crear el cobro:", error);
      throw error;
    }
  };

  return { postPayment, loading, error };
};
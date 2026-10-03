import { useState } from 'react';
import { useApi } from '../../../hooks';
import { closeModal } from '../../../utils';

export const useReactivateTreatment = () => {
    const { trigger: triggerDischarge } = useApi({ method: 'POST', url: '/cierre-tratamientos' });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const reactivateTreatment = async (patientId) => {
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const dischargeResponse = await triggerDischarge({
                id_patient: patientId,
                type: 'Reactivación del tratamiento',
                closing_reason: 'Reactivación del tratamiento'
            });

            if (dischargeResponse?.status === 'error') throw new Error(dischargeResponse.message);

            setSuccessMessage('¡Tratamiento reactivado exitosamente!');
            
            setTimeout(() => {
                closeModal('reactivateTreatmentModal');
                window.location.reload();
            }, 1000);

        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || 'Error al reactivar el tratamiento');
        } finally {
            setLoading(false);
        }
    };

    return { reactivateTreatment, loading, errorMessage, successMessage };
};

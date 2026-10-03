import { useEffect, useState } from "react";
import { useApi } from "../../../hooks";

/**
 * Obtiene la primera entrevista (detallada) de un paciente.
 * El backend devuelve un único objeto de entrevista (no un array),
 * así que este hook expone directamente ese objeto como `interview`.
 */
export const useGetFirstInterviewByPatient = (id_patient) => {
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finalError, setFinalError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const { data, error, loading, trigger } = useApi({
    url: id_patient ? `/primeras-entrevistas/paciente/${id_patient}` : "",
    method: "GET",
    autoFetch: !!id_patient,
  });

  // Cuando cambia el paciente, reseteamos el estado local
  useEffect(() => {
    if (!id_patient) {
      setInterview(null);
      setIsLoading(false);
      setFinalError(null);
      setIsNotFound(false);
      return;
    }
    setInterview(null);
    setIsLoading(true);
    setFinalError(null);
    setIsNotFound(false);
  }, [id_patient]);

  const refetch = async () => {
    if (!id_patient) return;
    setIsLoading(true);
    setFinalError(null);
    setIsNotFound(false);
    await trigger();
  };

  useEffect(() => {
    // Sincronizar el loading interno con el del useApi
    if (loading) {
      setIsLoading(true);
      return;
    }

    // Si hay datos exitosos del backend
    if (data && data.status === "success") {
      // El backend envía un solo objeto de entrevista en data.data
      setInterview(data.data || null);
      setFinalError(null);
      setIsNotFound(false);
      setIsLoading(false);
      return;
    }

    const httpStatus = data?.httpStatus ?? error?.status;

    // Un 404 significa realmente que el paciente todavía no tiene entrevista.
    if (data?.status === "error" && httpStatus === 404 && !loading) {
      setInterview(null);
      setFinalError(null);
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    // Una falla de red o del servidor no equivale a "sin entrevista".
    if ((error || data?.status === "error") && !loading) {
      setInterview(null);
      setFinalError(error || new Error(data?.message || "No se pudo cargar la entrevista."));
      setIsNotFound(false);
      setIsLoading(false);
    }
  }, [data, error, loading, id_patient]);

  // Consideramos que está cargando mientras:
  // - hay un id_patient válido Y
  //   - o bien estamos en estado isLoading
  //   - o bien todavía no tenemos entrevista ni error procesado
  const effectiveLoading =
    !!id_patient && (isLoading || (!interview && !finalError && !isNotFound));

  return { interview, loading: effectiveLoading, error: finalError, refetch };
}

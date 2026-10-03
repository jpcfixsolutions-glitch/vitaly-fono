import { useState } from "react";
import { useApi } from "../../../hooks";
import { checkIfTurnsOverlap } from "../utils";
import { getUser } from "../../../utils/getUser";


/**
 * Hook para crear una configuración de calendario
 * @returns - Función para crear la configuración de calendario, estado de carga y error
 */
export const usePostConfigurationTimetable = (dataConfigurationTimetable) => {
  const [localError, setLocalError] = useState(null);

  const { trigger, loading, error } = useApi({
    url: "/configuraciones-calendario",
    method: "POST",
  });

  const postConfigurationTimetable = async (formData) => {
    try {
      const sanitizedData = {
        ...formData,
        day: formData.day?.trim(),
        start_time: formData.start_time?.trim(),
        end_time: formData.end_time?.trim(),
        id_user: getUser().id,
      }

      checkIfTurnsOverlap(dataConfigurationTimetable, formData, sanitizedData, setLocalError);

      const response = await trigger(sanitizedData);
      setLocalError(null);
      return response;
    } catch (error) {
      setLocalError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  return { postConfigurationTimetable, loading, error: localError || error };
}

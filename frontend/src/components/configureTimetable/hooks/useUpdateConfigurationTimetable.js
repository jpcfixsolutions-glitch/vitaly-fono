import { useState } from "react";
import { useApi, useGet } from "../../../hooks"
import { checkIfTurnsOutOfScheduleOrOverlap, getDaysOfPendings, getTurnsPendings } from "../utils";

const today = new Date().toISOString().split('T')[0];

/**
 * Hook para actualizar una configuración de calendario
 * @param {*} dataConfigurationTimetable - Datos de la configuración de calendario
 * @returns - Función para actualizar la configuración de calendario, estado de carga y error
 */
export const useUpdateConfigurationTimetable = (dataConfigurationTimetable) => {

  const [localError, setLocalError] = useState(null);

  const { dataGet: dataTurns } = useGet({ url: "/turnos", method: "GET", autoFetch: true, needFilterByStatus: false });

  const pendingTurns = getTurnsPendings(dataTurns?.data, today);

  const daysOfPendingsTurns = getDaysOfPendings(pendingTurns);

  const { trigger, loading, error } = useApi({
    id: dataConfigurationTimetable?.id,
    url: "/configuraciones-calendario",
    method: "PATCH",
  });

  const updateConfigurationTimetable = async (formData) => {
    if (!dataConfigurationTimetable?.id) {
      throw new Error("No se ha proporcionado un ID válido para actualizar la configuración");
    }

    try {
      const sanitizedData = {
        ...formData,
        day: formData.day?.trim(),
        start_time: formData.start_time?.trim(),
        end_time: formData.end_time?.trim(),
      }

      checkIfTurnsOutOfScheduleOrOverlap(daysOfPendingsTurns, formData, sanitizedData, setLocalError);

      const response = await trigger(sanitizedData);
      setLocalError(null);
      return response;
    } catch (error) {
      setLocalError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  return { updateConfigurationTimetable, loading, error: localError || error };
}
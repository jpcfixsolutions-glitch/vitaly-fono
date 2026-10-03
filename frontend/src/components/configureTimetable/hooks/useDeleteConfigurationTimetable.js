import { useState } from "react";
import { useApi, useGet } from "../../../hooks";
import { getDaysOfPendings, getTurnsPendings } from "../utils";

const today = new Date().toISOString().split('T')[0];

/**
 * Hook para eliminar una configuración de calendario
 * @param {*} dataConfigurationTimetable - Datos de la configuración de calendario
 * @returns - Función para eliminar la configuración de calendario, estado de carga y error
 */
export const useDeleteConfigurationTimetable = (dataConfigurationTimetable) => {

  const [localError, setLocalError] = useState(null);

  const { dataGet: dataTurns } = useGet({
    url: "/turnos",
    method: "GET",
    autoFetch: true,
    needFilterByStatus: false
  });

  // Turnos con fecha igual o posterior a hoy
  const pendingTurns = getTurnsPendings(dataTurns?.data || [], today);

  // Solo consideramos turnos que NO estén cancelados
  const activePendingTurns = pendingTurns.filter(t => t.status !== "Cancelado");

  // Mapeamos solo los turnos activos (no cancelados) por día
  const daysOfActivePendingsTurns = getDaysOfPendings(activePendingTurns);

  const { trigger, loading, error } = useApi({
    id: dataConfigurationTimetable?.id,
    url: "/configuraciones-calendario",
    method: "DELETE"
  });

  const deleteConfigurationTimetable = async () => {
    if (!dataConfigurationTimetable?.id) {
      throw new Error("No se ha proporcionado un ID válido para eliminar la configuración");
    }

    try {
      const day = dataConfigurationTimetable.day;
      const start = dataConfigurationTimetable.start_time;
      const end = dataConfigurationTimetable.end_time;

      // Lista de turnos activos (no cancelados) para ese día
      const list = daysOfActivePendingsTurns[day] || [];
      const toHHMM = (s) => (typeof s === 'string' ? s.slice(0, 5) : s);

      const affectedForHours = list.filter(t => {
        const hhmm = toHHMM(t.date);
        return hhmm >= start && hhmm < end;
      });

      // Si hay turnos activos en ese rango horario, bloqueamos el borrado
      if (affectedForHours.length > 0) {
        const validationError = new Error("Hay citas que quedarían afectadas en este cambio de horario. Reprogramarlas antes de eliminar.");
        setLocalError(validationError);
        throw validationError;
      }

      const response = await trigger();
      setLocalError(null);
      return response;
    } catch (error) {
      setLocalError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  return { deleteConfigurationTimetable, loading, error: localError || error };
}
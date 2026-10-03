import { useState, useEffect } from 'react';
import { useGetAllTurns } from '../../../hooks/useGetAllTurns';
import { useGetConfigurationsCalendar } from '../../../hooks/useGetConfigurationsCalendar';
import { parsedConfigurationData } from '../utils';

/**
 * useCalendar
 * 
 * Custom hook que centraliza y coordina la obtención y el manejo del estado de los turnos y configuraciones del calendario.
 * Utiliza otros hooks personalizados como useGetTurns y useGetConfigurationsCalendar para solicitar datos a las APIs asociadas y así obtener tanto los turnos (events) como las configuraciones del calendario.
 *
 * Hooks utilizados:
 * - `useState`: para manejar el estado local de los eventos obtenidos desde la base de datos.
 * - `useEffect`: para sincronizar el estado local de events cada vez que se actualizan los datos remotos de turnos.
 * - `useGetTurns`: hook personalizado que obtiene los turnos desde el backend, y expone sus datos, loading y error.
 * - `useGetConfigurationsCalendar`: hook personalizado que obtiene las configuraciones del calendario desde el backend, y expone sus datos, loading y error.
 * - `parsedConfigurationData`: función que procesa los datos de las configuraciones del calendario para obtener los horarios de atención del día.
 * Descripción del efecto:
 * - El useEffect incluido en este hook se encarga de actualizar el estado local `events` con los turnos obtenidos (`dataTurns.data`)
 *   cada vez que cambian los turnos desde la base de datos.
 *   De esta manera, se mantiene sincronizada la lista de eventos en el estado con la información más reciente proveniente del servidor.
 *
 * Retorna:
 * - events: listado actualizado de turnos provenientes del backend.
 * - apiLoadingGetTurns: estado de carga de la petición de turnos.
 * - apiLoadingGetConfigurations: estado de carga para configuraciones.
 * - apiErrorGetTurns: errores derivados de la petición de turnos.
 * - apiErrorGetConfigurations: errores derivados de la petición de configuraciones.
 * - parsedConfigurationCalendarData: información de configuración general del calendario procesada para obtener los horarios de atención del día.
 */
export const useCalendar = () => {

  const [events, setEvents] = useState([]);

  // Utiliza el hook personalizado para obtener turnos desde la API
  const { turns: dataTurns, loading: apiLoadingGetTurns, error: apiErrorGetTurns } = useGetAllTurns({
    url: "/turnos",
    method: "GET",
    autoFetch: true
  });

  // Utiliza el hook personalizado para obtener configuraciones del calendario desde la API
  const { configurations: dataGetConfigurations, loading: apiLoadingGetConfigurations, error: apiErrorGetConfigurations } = useGetConfigurationsCalendar({
    url: "/configuraciones-calendario",
    method: "GET",
    autoFetch: true,
  });

  // Procesa los datos de las configuraciones del calendario para obtener los horarios de atención del día.
  // Esto se hace para poder mostrar los horarios de atención del día en el calendario.
  const { parsedConfigurationCalendarData } = parsedConfigurationData(dataGetConfigurations);

  /**
   * Efecto que actualiza el estado local de eventos cada vez que los datos de turnos (provenientes del backend) cambian.
   * Esto asegura que el estado de events siempre refleje la información más reciente de la base de datos.
   */
  useEffect(() => {
    if (dataTurns && Array.isArray(dataTurns.data)) {
      setEvents(dataTurns.data);
    }
  }, [dataTurns]);

  return {
    events,
    apiLoadingGetTurns,
    apiErrorGetTurns,
    apiLoadingGetConfigurations,
    apiErrorGetConfigurations,
    parsedConfigurationCalendarData
  };
};

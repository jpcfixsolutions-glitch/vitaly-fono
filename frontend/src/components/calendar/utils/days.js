/**
 * Procesa la configuración de días y horarios del calendario. Esta función es usada para procesar los datos de las configuraciones del calendario para obtener los horarios de atención del día y asi poder mostrarlos o habilitar esos campos/celdas en el calendario.
 * 
 * @param {Object} dataConfigurations - Objeto que contiene la configuración de días. Espera una propiedad 'data' con objetos de configuración por día.
 * @param {Object.<string, {day: string, start_time: string, end_time: string}>} dataConfigurations.data - Objeto cuyas claves son IDs y cuyas propiedades son configuraciones de días.
 * @returns {{ parsedConfigurationCalendarData: Object.<number, Array<{start: string, end: string}>> }}
 *   Un objeto con una propiedad 'parsedConfigurationCalendarData', que es un mapping de índices (0=Domingo, ... 6=Sábado) a arrays de objetos con propiedades 'start' y 'end' en formato 'hh:mm'.
 *   Si no hay datos de configuración, devuelve todos los días con horario 00:00 a 00:00.
 *
 * @example
 * const configs = { data: { '1': { day: 'Lunes', start_time: '08:00', end_time: '18:00' } } };
 * const { parsedConfigurationCalendarData } = parsedConfigurationData(configs);
 * // parsedConfigurationCalendarData[1] = [{ start: '08:00', end: '18:00' }]
 */
export const parsedConfigurationData = (dataConfigurations) => {
  const parsedConfigurationCalendarData = {};
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  if (!dataConfigurations?.data || Object.keys(dataConfigurations.data).length === 0) {
    // Si no hay datos, inicializar todos los días con horario 00:00
    days.forEach((day, index) => {
      parsedConfigurationCalendarData[index] = [{
        start: '00:00',
        end: '00:00'
      }];
    });
  } else {
    Object.values(dataConfigurations.data).forEach(day => {
      // Si el día ya existe en parsedConfigurationCalendarData, agregamos el nuevo registro al array
      const dayIndex = days.indexOf(day.day);
      if (parsedConfigurationCalendarData[dayIndex]) {
        parsedConfigurationCalendarData[dayIndex].push({
          start: day.start_time,
          end: day.end_time
        });
      } else {
        // Si no existe, inicializamos un array con el primer registro
        parsedConfigurationCalendarData[dayIndex] = [{
          start: day.start_time,
          end: day.end_time
        }];
      }
    });
  }

  return { parsedConfigurationCalendarData };
}

/**
 * Genera un array de objetos que representan los horarios comerciales (business hours) 
 * para cada día de la semana a partir de la configuración procesada.
 *
 * @param {Object.<number, Array<{start: string, end: string}>>} days 
 *   Objeto donde la clave es el índice del día de la semana (0=Domingo, ..., 6=Sábado),
 *   y el valor es un array de objetos con propiedades 'start' y 'end' en formato 'hh:mm'.
 *   Ejemplo: { 1: [{ start: '08:00', end: '12:00' }, { start: '16:00', end: '18:00' }], ... }
 *
 * @returns {Array<{daysOfWeek: number[], startTime: string, endTime: string}>}
 *   Array donde cada elemento especifica el/los días de la semana (daysOfWeek) aplicable(s) y su bloque horario,
 *   siguiendo el formato requerido por componentes de calendario como FullCalendar.
 *   Ejemplo de resultado:
 *   [
 *     { daysOfWeek: [1], startTime: '08:00', endTime: '12:00' },
 *     { daysOfWeek: [1], startTime: '16:00', endTime: '18:00' },
 *   ]
 *
 * Consideraciones:
 * - Si un día tiene múltiples bloques horarios, genera una entrada separada para cada uno.
 * - Si el array para un día tiene solo un bloque, agrega una sola entrada.
 */
export const getBusinessHours = (days) => {
  const businessHours = [];
  for (const day in days) {
    // Si hay múltiples horarios para ese día, agrega cada uno como registro separado
    if (days[day].length > 1) {
      days[day].forEach(schedule => {
        businessHours.push({
          daysOfWeek: [parseInt(day)],
          startTime: schedule.start,
          endTime: schedule.end
        });
      });
      continue;
    }
    // Solo un bloque horario para ese día
    businessHours.push({
      daysOfWeek: [parseInt(day)],
      startTime: days[day][0].start,
      endTime: days[day][0].end
    });
  }

  return businessHours;
}
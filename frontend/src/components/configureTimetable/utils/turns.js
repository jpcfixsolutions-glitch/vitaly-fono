export const getTurnsPendings = (turns, today) => {
  return turns.filter(turn => turn.date >= today);
}

export const getDaysOfPendings = (turns) => {

  const affectedDays = {};

  turns.map(turn => {

    const date = new Date(turn.date);
    const day = date.toLocaleDateString('es-ES', { weekday: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1);

    if (affectedDays[day]) {
      affectedDays[day].push({
        date: turn.date.split('T')[1].split('-')[0],
      })
    } else {
      affectedDays[day] = [{
        date: turn.date.split('T')[1].split('-')[0],
      }]
    }
  });

  return affectedDays;
}


/**
 * Verifica si hay solapamiento entre un horario y una configuración de calendario
 * @param {*} dataConfigurationTimetable - Datos de la configuración de calendario
 * @param {*} formData - Datos del formulario
 * @param {*} sanitizedData - Datos sanitizados
 * @param {*} setLocalError - Función para establecer el error local
 * @returns - Error si hay solapamiento
 */
export const checkIfTurnsOverlap = (dataConfigurationTimetable, formData, sanitizedData, setLocalError) => {
  dataConfigurationTimetable?.data?.forEach(configuration => {
    if (configuration.day === formData.day) {
      if (sanitizedData.start_time >= configuration.start_time && sanitizedData.end_time <= configuration.end_time) {
        const validationError = new Error("Este horario no es posible debido hay una configuración que lo incluye.");
        setLocalError(validationError);
        throw validationError;
      }
    }
  });
}


/**
 * Verifica si hay citas que quedarían fuera o se solaparían con el nuevo horario
 * @param {*} daysOfPendingsTurns - Dias de citas pendientes
 * @param {*} formData - Datos del formulario
 * @param {*} sanitizedData - Datos sanitizados
 * @param {*} setLocalError - Función para establecer el error local
 * @returns - Error si hay citas que quedarían fuera o se solaparían con el nuevo horario
 */
export const checkIfTurnsOutOfScheduleOrOverlap = (daysOfPendingsTurns, formData, sanitizedData, setLocalError) => {
  Object.keys(daysOfPendingsTurns).forEach(day => {
    if (day === formData.day) {
      daysOfPendingsTurns[day].forEach(turnTime => {
        // Check if turn time overlaps with new schedule
        const turnStart = turnTime.date;
        const turnEnd = turnTime.date.split(':')[0] + ':59'; // Assuming 1 hour duration

        if (
          // Turn starts before schedule and ends during schedule
          (turnStart < sanitizedData.start_time && turnEnd > sanitizedData.start_time) ||
          // Turn starts during schedule and ends after schedule  
          (turnStart < sanitizedData.end_time && turnEnd > sanitizedData.end_time) ||
          // Turn is completely outside schedule
          (turnStart < sanitizedData.start_time || turnEnd > sanitizedData.end_time)
        ) {
          const validationError = new Error("Hay citas que quedarían fuera o se solaparían con el nuevo horario. Por favor revise los cambios.");
          setLocalError(validationError);
          throw validationError;
        }
      });
    }
  })
}
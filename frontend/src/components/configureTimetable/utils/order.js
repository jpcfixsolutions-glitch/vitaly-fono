/**
 * Ordena los datos por día y hora de inicio
 * @param {*} data - Datos a ordenar
 * @returns - Datos ordenados
 */
export const orderByDayAndStartTime = (data) => {
  const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const toMinutes = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string') return Number.MAX_SAFE_INTEGER;
    const [h, m] = hhmm.split(':').map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : Number.MAX_SAFE_INTEGER;
  };

  return [...(Array.isArray(data) ? data : [])].sort((a, b) => {
    const ai = daysOrder.indexOf(a?.day);
    const bi = daysOrder.indexOf(b?.day);
    const sa = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const sb = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    if (sa !== sb) return sa - sb;
    return toMinutes(a?.start_time) - toMinutes(b?.start_time);
  });
};
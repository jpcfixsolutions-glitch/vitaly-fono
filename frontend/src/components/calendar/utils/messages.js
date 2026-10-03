/**
 * Construye un mensaje de WhatsApp para notificar sobre un turno agendado.
 *
 * @param {Object} params - Parámetros para el mensaje.
 * @param {string} [params.name=""] - Nombre del destinatario.
 * @param {string} [params.fechaStr=""] - Fecha del turno, ya formateada como string.
 * @param {string} [params.horaStr=""] - Hora del turno, ya formateada como string.
 * @returns {string} Mensaje listo para enviar por WhatsApp.
 */
export function buildWhatsAppMessage({ name = "", fechaStr = "", horaStr = "" } = {}) {
  const cleanName = (name || "").trim();
  const fecha = fechaStr || "";
  const hora = horaStr || "";
  return `¡Hola ${cleanName}! Somos Boavida y te contamos que tenes un turno agendado para el ${fecha} a las ${hora}. Por favor, necesitaríamos que confirmes asistencia. ¡Muchas gracias!`;
}
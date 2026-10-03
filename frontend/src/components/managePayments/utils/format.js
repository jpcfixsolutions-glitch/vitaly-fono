/**
 * Formatea un monto en ARS a formato de moneda.
 *
 * @param {number} amount - El monto a formatear.
 * @returns {string} El monto formateado en formato de moneda.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
};

/**
 * Normaliza un mapa de pacientes por ID como string (evita desajustes number/string).
 *
 * @param {Array<Object>} patients - Lista de pacientes.
 * @returns {Map<string, Object>} - Mapa normalizado de pacientes por ID.
 */
export const formatPatientsById = (patients) => {
  return new Map(patients.map(p => [String(p.id), p]));
};

/**
 * Formatea una lista de obras sociales a opciones para select.
 * @param {Array<{id: string|number, name: string}>} healthInsurances - Lista de obras sociales.
 * @returns {Array<{value: string|number, label: string}>} Opciones para select.
 */
export const formatHealthInsuranceOptions = (healthInsurances) => {
  return healthInsurances.map(h => ({ value: h.id, label: h.name }));
};

/**
 * Formatea una lista de métodos de pago a opciones para select.
 * @param {Array<{id: string|number, name: string}>} paymentMethods - Lista de métodos de pago.
 * @returns {Array<{value: string|number, label: string}>} Opciones para select.
 */
export const formatPaymentMethodOptions = (paymentMethods) => {
  return paymentMethods
    .filter(m => m.status === 'Activo')
    .map(m => ({ value: m.id, label: m.name }));
};

/**
 * Formatea una lista de servicios a opciones para select, agregando el precio.
 * @param {Array<{id: string|number, name: string, price: number|string}>} services - Lista de servicios.
 * @returns {Array<{value: string|number, label: string, price: number}>} Opciones para select con precio.
 */
export const formatServiceOptions = (services) => {
  return services.map(s => ({ value: s.id, label: s.name, price: Number(s.price) || 0 }));
};

/**
 * Normaliza los pagos para que los filtros y la tabla tengan los campos esperados.
 * Agrega fecha en YYYY-MM-DD, formatea display y copia nombres/campos de tabla.
 */
export const formatPaymentsForFilters = (payments = []) => {
  const toDisplayDateTime = (iso) => {
    if (!iso) return { fecha: "", fechaDisplay: "", hora: "" };
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { fecha: "", fechaDisplay: "", hora: "" };
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return {
      fecha: `${yyyy}-${mm}-${dd}`,
      fechaDisplay: `${dd}/${mm}/${yyyy}`,
      hora: `${hh}:${mi}`,
    };
  };

  const items = Array.isArray(payments) ? payments.filter(Boolean) : [];
  return items.map((p) => {
    const { fecha, fechaDisplay, hora } = toDisplayDateTime(p.paid_at || p.created_at);
    const amountNum = Number(p.amount) || 0;

    return {
      id: p.id,
      fecha,
      fechaDisplay,
      hora,
      nombre: p.patient_name || "",
      apellido: p.patient_last_name || "",
      obraSocial: p.health_insurance_name || "",
      metodoPago: p.payment_method_name || "",
      servicio: p.service_name || "",
      monto: amountNum,
      notes: p.notes || "",
      id_session: p.id_session,
      session_date: p.session_date,
      // Claves que espera la tabla (según columnas actuales)
      _id: p.id,
      paid_at: `${fechaDisplay} ${hora}`.trim(),
      name: p.patient_name || "",
      last_name: p.patient_last_name || "",
      health_insurance_name: p.health_insurance_name || "",
      payment_method_name: p.payment_method_name || "",
      service_name: p.service_name || "",
      amount: amountNum,
      status: p.status,
    };
  });
};

/**
 * Formatea una lista de sesiones completadas o creadas a opciones para select.
 * Incluye información del paciente y metadatos útiles.
 *
 * @param {Array<Object>} sessions - Lista de sesiones.
 * @param {Map<string, Object>} patientById - Mapa de pacientes por ID como string.
 * @returns {Array<Object>} Opciones para select, cada una con value, label y meta detallado.
 */
export const formatSessionOptions = (sessions, patientById) => {
  return sessions
    .filter(s => s?.status === "Completada" || s?.status === "Creada")
    .filter(s => {
      const patient = patientById.get(String(s.id_patient ?? ""));
      return !!patient;
    })
    .map(s => {
      // Armamos el formato en cómo se mostrarán las opciones: primero el nombre y apellido del paciente, luego la fecha y la hora de la sesión.

      // Tomamos la fecha, separamos la fecha y la hora por la T.
      const d = new Date((s.session_date || "").replace(" ", "T"));
      const date = !isNaN(d.getTime()) ? d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
      const time = !isNaN(d.getTime()) ? d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "";

      // Tomamos el nombre y el apellido del paciente y unimos todo con un join.
      const patient = patientById.get(String(s.id_patient ?? ""));
      const firstName = `${patient?.name || ""}`.trim();
      const lastName = `${patient?.last_name || ""}`.trim();

      const label = [`${firstName} ${lastName}`.trim(), date && `${date} - ${time} hs`.trim()].filter(Boolean).join(" | ");

      return {
        value: s.id,
        label,
        meta: {
          date,
          time,
          firstName,
          lastName,
          patientId: patient?.id,
          healthInsuranceId: (patient && patient.id_health_insurance) || ""
        }
      };
    });
};
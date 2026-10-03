/**
 * Handler para cambios en el campo "sesión" de un formulario de pago.
 *
 * Al seleccionar una sesión (por ejemplo, en un Select), esta función extrae
 * los datos relevantes de la sesión seleccionada (nombre, apellido, fecha, hora, obra social)
 * y los establece en el formulario usando "setValue". También resuelve de manera robusta
 * la obra social asociada al paciente de la sesión, normalizando el id y chequeando por nombre en caso de ser necesario.
 *
 * @param {Array<Object>} sessionOptions - Lista de opciones de sesiones, cada una con una estructura que incluye "value" (id) y "meta" (info adicional: nombre, fecha, etc).
 * @param {Array<{ value: any, label: string }>} healthInsuranceOptions - Lista de obras sociales disponibles, con "value" como id y "label" como nombre.
 * @param {Function} setValue - Función para establecer valores en el formulario (por ejemplo, proveniente de react-hook-form).
 * @returns {Function} Función manejadora (handler) que recibe el valor seleccionado (id de sesión), y actualiza los campos dependientes.
 */
export const handleSessionChange = (sessionOptions, healthInsuranceOptions, setValue) => (value) => {
  const selected = sessionOptions.find(opt => opt.value === value);
  if (selected) {
    const { meta } = selected;

    // Establecer nombre, apellido, fecha y hora a partir de los metadatos de la sesión seleccionada
    setValue("first_name", meta?.firstName || meta?.patientName || "");
    setValue("last_name", meta?.lastName || meta?.patientLastName || "");
    setValue("date", meta?.date || meta?.fecha || "");
    setValue("time", meta?.time || meta?.hora || "");
    setValue("id_patient", meta?.patientId || "");

    // Resolver obra social a partir del id guardado en los metadatos.
    const candidate = meta?.healthInsuranceId;
    if (candidate === null || candidate === undefined || candidate === "") {
      // Si no hay información de obra social, limpiar el valor
      setValue("id_health_insurance", "");
    } else {
      // Buscar la obra social por id (normalizando a string para evitar problemas de tipos)
      const byId = healthInsuranceOptions.find(h => String(h.value) === String(candidate));
      if (byId) {
        setValue("id_health_insurance", byId.value);
      } else {
        // Fallback: si accidentalmente viene el nombre, buscar por label (insensible a mayúsculas)
        const byLabel = healthInsuranceOptions.find(h => String(h.label).toLowerCase() === String(candidate).toLowerCase());
        setValue("id_health_insurance", byLabel ? byLabel.value : "");
      }
    }
  } else {
    // Si no hay sesión seleccionada, limpiar todos los campos dependientes
    setValue("first_name", "");
    setValue("last_name", "");
    setValue("date", "");
    setValue("time", "");
    setValue("id_health_insurance", "");
    setValue("id_patient", "");
  }
};
/**
 * Filtra y transforma la lista de pacientes según los filtros proporcionados.
 *
 * @param {Object|Array} source - Puede ser un objeto con la propiedad `data` (arreglo de pacientes) o un arreglo de pacientes directamente.
 * @param {Object} filters - Objeto con posibles filtros, como `fullName` (nombre completo) y `status` ('active', 'inactive' o vacío).
 * @param {function} getAge - Función que recibe una fecha de nacimiento y retorna la edad.
 * @returns {Array} Lista de pacientes filtrada y enriquecida con los campos `full_name` y `age`.
 */
export const buildFilteredPatients = (source, filters, getAge) => {
  const base = Array.isArray(source?.data) ? source.data : Array.isArray(source) ? source : [];
  let list = base.map(patient => {
    const dateField = patient.birth_date || patient.fecha_nacimiento || null;
    const age = getAge(dateField);
    return {
      ...patient,
      full_name: `${patient.name} ${patient.last_name}`,
      age
    };
  });

  if ((filters?.fullName || '').trim() !== '') {
    const searchTerm = filters.fullName.toLowerCase();
    list = list.filter(p => {
      const fullName = `${p.name} ${p.last_name}`.toLowerCase();
      const reverseName = `${p.last_name} ${p.name}`.toLowerCase();
      return fullName.includes(searchTerm) || reverseName.includes(searchTerm);
    });
  }

  if (filters?.status === 'active') {
    list = list.filter(p => p.status === "Activo" || p.status === true);
  } else if (filters?.status === 'inactive') {
    list = list.filter(p => p.status === "Inactivo" || p.status === false);
  }

  return list;
};

/**
 * Busca y retorna un paciente en la fuente proporcionada por su número de documento.
 *
 * @param {Object|Array} source - Puede ser un objeto con la propiedad `data` (arreglo de pacientes) o un arreglo de pacientes directamente.
 * @param {string|number} documentNumber - El número de documento del paciente que se desea buscar.
 * @returns {Object|undefined} El paciente encontrado o undefined si no existe.
 */
export const findPatientByDocument = (source, documentNumber) => {
  const base = Array.isArray(source?.data) ? source.data : Array.isArray(source) ? source : [];
  return base.find(p => p.document_number === documentNumber);
};



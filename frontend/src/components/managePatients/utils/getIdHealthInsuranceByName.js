/**
 * Busca y devuelve el (los) ID(s) de obra social cuyo label coincida con el nombre especificado.
 *
 * @param {Array|Object} transformedHealthInsurance - Arreglo o diccionario de obras sociales transformados, donde cada objeto incluye un 'label' y un 'value'.
 * @param {string} name - Nombre (label) de la obra social a buscar.
 * @returns {Array} Un array con los value(s) de las obras sociales que coinciden con el nombre.
 */
export const getIdHealthInsuranceByName = (transformedHealthInsurance, name) => {
  return Object.values(transformedHealthInsurance).map(insurance => {
    if (insurance.label === name) {
      return insurance.value;
    }
  });
}
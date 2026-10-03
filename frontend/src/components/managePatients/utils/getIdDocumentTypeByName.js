/**
 * Busca y devuelve el (los) ID(s) de tipo de documento cuyo label coincida con el nombre especificado.
 *
 * @param {Array|Object} transformedDocumentTypes - Arreglo o diccionario de tipos de documentos transformados, donde cada objeto incluye un 'label' y un 'value'.
 * @param {string} name - Nombre (label) del tipo de documento a buscar.
 * @returns {Array} Un array con los value(s) de los tipos de documento que coinciden con el nombre.
 */
export const getIdDocumentTypeByName = (transformedDocumentTypes, name) => {
  return Object.values(transformedDocumentTypes).map(type => {
    if (type.label === name) {
      return type.value;
    }
  });
}
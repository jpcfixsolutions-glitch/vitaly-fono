/**
 * Transforma un array o un objeto con propiedad `data` (array) en un array de opciones para un select.
 *
 * @param {Object|Array} items - Un array de elementos, o un objeto con la propiedad `data` que contiene el array.
 * @param {string} [labelKey='name'] - La clave que se usará para mostrar el label de cada opción.
 * @returns {Array<{ value: any, label: string }>} Un array de objetos con las propiedades `value` y `label` para usar en un select.
 */
export const transformSelectOptions = (items, labelKey = 'name') => {
  if (Array.isArray(items?.data)) {
    return items.data.map(it => ({ value: it.id, label: it[labelKey] }));
  }
  if (Array.isArray(items)) {
    return items.map(it => ({ value: it.id, label: it[labelKey] }));
  }
  return [];
};
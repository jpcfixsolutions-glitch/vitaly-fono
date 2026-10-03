/**
 * Handler to update the amount field based on the selected service.
 *
 * @param {Array<{value: any, price: number}>} serviceOptions - Lista de servicios disponibles, cada uno con un valor y un precio.
 * @param {Function} setValue - Función para establecer el valor de un campo en el formulario.
 * @returns {Function} - Función manejadora que recibe el valor seleccionado y actualiza el campo "amount".
 */
export const handleServiceChange = (serviceOptions, setValue) => (value) => {
  const srv = serviceOptions.find(s => s.value === value);
  setValue("amount", srv ? srv.price : 0);
};
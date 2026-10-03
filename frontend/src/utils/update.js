import { handleSuccess } from "./success";


/**
 * Maneja el envío de los datos de un formulario -UPDATE- a la API y maneja el éxito de la operación
 * @param {*} formData - Datos del formulario
 * @param {*} setDataUpdate - Setter del estado con la fila seleccionada para actualizar
 * @param {*} updateFunction - Función para enviar el formulario (API)
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 * @param {*} entity - Entidad a la que se está actualizando el registro
 */
const handleUpdateSubmit = async (formData, setDataUpdate, updateFunction, idModal, setSuccessState, entity = "") => {
  try {
    // Sincroniza el estado local con los datos del formulario para que el modal muestre el cambio instantáneo
    setDataUpdate(prev => (prev ? { ...prev, ...formData } : null));

    const response = await updateFunction(formData);
    if (response.status === "success") {
      handleSuccess(idModal, setSuccessState);
    }
  } catch (error) {
    console.error(`Error al actualizar el registro de la entidad ${entity}:`, error);
    throw error;
  }
}

/**
 * Factory
 * Se usa para que cada componente cree su propia función para manejar el envío de los datos de un formulario -UPDATE- a la API y maneja el éxito de la operación
 * @param {*} setDataUpdate - Setter del estado con la fila seleccionada para actualizar
 * @param {*} updateFunction - Función para enviar el formulario (API)
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 * @param {*} entity - Entidad a la que se está actualizando el registro
 */
export const makeUpdateHandler = (setDataUpdate, updateFunction, idModal, setSuccessState, entity = "") =>
  async (formData) => handleUpdateSubmit(formData, setDataUpdate, updateFunction, idModal, setSuccessState, entity);
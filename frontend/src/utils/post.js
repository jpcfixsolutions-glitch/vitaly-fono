import { handleSuccess } from "./success";


/**
 * Maneja el envío de los datos de un formulario -POST- a la API y maneja el éxito de la operación
 * @param {*} formData - Datos del formulario
 * @param {*} postFunction - Función para enviar el formulario
 * @param {*} setSuccessState - Estado de éxito
 */
export const handlePost = async (formData, postFunction, idModal, setSuccessState, entity = "") => {
  try {
    const response = await postFunction(formData);
    if (response.status === "success") {
      handleSuccess(idModal, setSuccessState);
    }
  } catch (error) {
    console.error(`Error al crear el registro de la entidad ${entity}:`, error);
    throw error;
  }
}


/**
 * Factory
 * Se usa para que cada componente cree su propia función para manejar el envío de los datos de un formulario -POST- a la API y maneja el éxito de la operación
 * @param {*} postFunction - Función para enviar el formulario
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 * @param {*} entity - Entidad a la que se está creando el registro
 */
export const makePostHandler = (postFunction, idModal, setSuccessState, entity = "") =>
  async (formData) => handlePost(formData, postFunction, idModal, setSuccessState, entity);
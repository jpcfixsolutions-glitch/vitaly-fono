import { handleSuccess } from "./success";

/**
 * Maneja el envío de los datos de un formulario -DEACTIVATE- a la API y maneja el éxito de la operación
 * @param {*} formData - Datos del formulario
 * @param {*} setDataDeactivate - Setter del estado con la fila seleccionada para desactivar
 * @param {*} deactivateFunction - Función para enviar el formulario (API)
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 * @param {*} entity - Entidad a la que se está desactivando el registro
 */
export const handleDeactivateSubmit = async (formData, setDataDeactivate, deactivateFunction, idModal, setSuccessState, entity = "") => {
  try {
    setDataDeactivate(prev => (prev ? { ...prev, ...formData } : null));

    const response = await deactivateFunction(formData);
    if (response.status === "success") {
      handleSuccess(idModal, setSuccessState);
    }
  } catch (error) {
    console.error(`Error al dar de baja el registro de la entidad ${entity}:`, error);
    throw error;
  }
}

/**
 * Factory
 * Se usa para que cada componente cree su propia función para manejar el envío de los datos de un formulario -DEACTIVATE- a la API y maneja el éxito de la operación
 * @param {*} setDataDeactivate - Setter del estado con la fila seleccionada para desactivar
 * @param {*} deactivateFunction - Función para enviar el formulario (API)
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 * @param {*} entity - Entidad a la que se está desactivando el registro
 */
export const makeDeactivateHandler = (setDataDeactivate, deactivateFunction, idModal, setSuccessState, entity = "") =>
  async (formData) => handleDeactivateSubmit(formData, setDataDeactivate, deactivateFunction, idModal, setSuccessState, entity);
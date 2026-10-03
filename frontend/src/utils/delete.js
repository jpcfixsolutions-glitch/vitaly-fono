import { handleSuccess } from "./success";

/**
 * Maneja el envío de los datos de un formulario -DELETE- a la API y maneja el éxito de la operación
 * @param {*} formData - Datos del formulario
 * @param {*} setDataDelete - Setter del estado con la fila seleccionada para eliminar
 * @param {*} deleteFunction - Función para enviar el formulario (API)
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 */
export const handleDeleteSubmit = async (formData, setDataDelete, deleteFunction, idModal, setSuccessState) => {
  setDataDelete(prev => (prev ? { ...prev, ...formData } : null));

  const response = await deleteFunction(formData);
  if (response.status === "success") {
    handleSuccess(idModal, setSuccessState);
  }
}

/**
 * Factory
 * Se usa para que cada componente cree su propia función para manejar el envío de los datos de un formulario -DELETE- a la API y maneja el éxito de la operación
 * @param {*} setDataDelete - Setter del estado con la fila seleccionada para eliminar
 * @param {*} deleteFunction - Función para enviar el formulario (API)
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 * @param {*} entity - Entidad a la que se está eliminando el registro
 */
export const makeDeleteHandler = (setDataDelete, deleteFunction, idModal, setSuccessState, entity = "") =>
  async (formData) => handleDeleteSubmit(formData, setDataDelete, deleteFunction, idModal, setSuccessState, entity);
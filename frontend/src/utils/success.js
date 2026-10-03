import { closeModal } from "./modal";


/**
 * Maneja el éxito de la operación, mostrando un mensaje de éxito y cerrando el modal
 * @param {*} idModal - ID del modal a cerrar
 * @param {*} setSuccessState - Estado de éxito
 */
export const handleSuccess = (idModal, setSuccessState) => {
  setSuccessState(true);
  setTimeout(() => {
    setSuccessState(false);

    closeModal(idModal);

    window.location.reload();
  }, 2250);
}
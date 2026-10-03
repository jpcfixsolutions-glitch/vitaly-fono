/**
 * Cierra un modal utilizando Bootstrap
 * @param {string} idModal - ID del modal a cerrar
 */
export const closeModal = (idModal) => {
  const modal = document.getElementById(idModal);
  if (modal) {
    const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
    bootstrapModal?.hide();
  }
}

/**
 * Abre un modal utilizando Bootstrap
 * @param {string} idModal - ID del modal a abrir
 */
export const openModal = (idModal) => {
  const modalEl = document.getElementById(idModal);
  window.bootstrap?.Modal.getOrCreateInstance(modalEl)?.show();
}
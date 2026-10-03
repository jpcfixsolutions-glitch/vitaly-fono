import { useEffect } from "react";

/**
 * Ejecuta un callback cuando un modal Bootstrap dispara el evento 'hidden.bs.modal'.
 */
export const useBootstrapModalHidden = (modalId, onHidden) => {
  useEffect(() => {
    if (!modalId || !onHidden) return;

    const modal = document.getElementById(modalId);
    if (!modal) return;

    const handleHidden = () => onHidden();
    modal.addEventListener('hidden.bs.modal', handleHidden);

    return () => {
      modal.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [modalId, onHidden]);
};



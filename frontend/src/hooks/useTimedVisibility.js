import { useEffect, useState } from "react";

/**
 * Controla la visibilidad temporal de un estado booleano en respuesta a un trigger.
 */
export const useTimedVisibility = ({ trigger, durationMs = 2000, showWhen = true }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === undefined || trigger === null) return;

    if ((!!trigger) === showWhen) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), durationMs);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [trigger, durationMs, showWhen]);

  return { visible, setVisible };
};



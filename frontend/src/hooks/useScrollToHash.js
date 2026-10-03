import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook para desplazar la página al elemento indicado por el hash de la URL
 */
export const useScrollToHash = ({ headerOffset = 80, delay = 1200, behavior = 'smooth' } = {}) => {
  const location = useLocation();

  useEffect(() => {
    if (!location?.hash) return;

    const elementId = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash;

    const scrollToElement = () => {
      const el = document.getElementById(elementId);
      if (!el) return;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      const targetTop = Math.max(0, elementTop - headerOffset);
      window.scrollTo({ top: targetTop, behavior });
    };

    const timeoutId = setTimeout(scrollToElement, delay);
    return () => clearTimeout(timeoutId);
  }, [location, headerOffset, delay, behavior]);
};



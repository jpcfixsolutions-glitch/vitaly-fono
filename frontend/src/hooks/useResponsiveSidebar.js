import { useEffect, useState } from 'react';

export function useResponsiveSidebar({ isSidebarOpen, setIsSidebarOpen, breakpoint = 768 }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detecta si estamos en mobile según el ancho de pantalla
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= breakpoint);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  // En mobile, forzamos el cierre del sidebar
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [isMobile, setIsSidebarOpen]);

  // Al abrir/cerrar el sidebar, disparamos un resize para recalcular layouts
  useEffect(() => {
    const timer = setTimeout(
      () => window.dispatchEvent(new Event('resize')),
      250
    );
    return () => clearTimeout(timer);
  }, [isSidebarOpen]);

  return { isMobile };
}



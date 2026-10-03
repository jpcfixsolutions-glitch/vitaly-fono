import { useEffect, useState } from 'react';

export function useSidebarState() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) return JSON.parse(savedState);
    return window.innerWidth > 768;
  });

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  return { isSidebarOpen, setIsSidebarOpen };
}
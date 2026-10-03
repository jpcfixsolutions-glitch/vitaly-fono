import { PanelRight } from 'lucide-react'

import './buttonToggleSidebar.css'

export const ButtonToggleSidebar = ({ onToggleSidebar }) => {
  return (
    <button
      className="header-menu-button"
      onClick={onToggleSidebar}
      aria-label="Toggle menu"
    >
      <span className="header-icon">
        <PanelRight size={20} />
      </span>
    </button>
  );
}
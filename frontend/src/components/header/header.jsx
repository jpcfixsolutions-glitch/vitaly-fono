
import { ButtonToggleSidebar, Logo, Role } from './components'

import './header.css'

export const Header = ({ onToggleSidebar, isSidebarOpen, userName, lastName, role }) => {
  return (
    <header className={`header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="header-content">
        <ButtonToggleSidebar onToggleSidebar={onToggleSidebar} />

        <Logo />

        <Role name={userName} lastName={lastName} role={role} />
      </div>
    </header>
  );
};


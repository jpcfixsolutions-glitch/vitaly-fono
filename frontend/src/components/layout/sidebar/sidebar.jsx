import { Link, useLocation } from "react-router-dom";
import './sidebar.css'
import { Home, Calendar, DollarSign, FileText, Users, Settings, User, Shield } from "lucide-react";
import { useAuth } from '../../../context/useAuth';

const menuItems = [
  {
    title: "Inicio",
    icon: Home,
    path: "/"
  },
  {
    title: "Gestión de Agenda",
    icon: Calendar,
    path: "/calendario",
    privilegio: "Gestión de Agenda"
  },
  {
    title: "Historias Clínicas",
    icon: FileText,
    path: "/historias-clinicas",
    privilegio: "Historias Clínicas"
  },
  {
    title: "Gestión de Cobros",
    icon: DollarSign,
    path: "/administrar-cobros",
    privilegio: "Historial de Cobros"
  },
  {
    title: "Gestión de Pacientes",
    icon: Users,
    path: "/gestionar-pacientes",
    privilegio: "Gestión de Pacientes"
  },
  {
    title: "Gestión de Usuarios",
    icon: User,
    path: "/gestionar-usuarios",
    privilegio: "Gestión de Usuarios"
  },
  {
    title: "Gestión de Roles",
    icon: Shield,
    path: "/gestionar-roles",
    privilegio: "Gestión de Roles"
  },
  {
    title: "Configuración",
    icon: Settings,
    path: "/configuracion",
    privilegio: "Configuración"
  }
];

export const Sidebar = ({ userName = "", onLogout }) => {
  const location = useLocation();
  const { privileges = [] } = useAuth();

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-placeholder">
            <User size={20} strokeWidth={2} />
          </div>
          <p className="user-name">{userName}</p>
        </div>
      </div>

      <nav className="sidebar-content">
        <ul className="sidebar-menu">
          {menuItems.filter(item =>
            !item.privilegio || privileges.includes(item.privilegio)
          ).map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="sidebar-menu-item">
                <Link
                  to={item.path}
                  className={`sidebar-menu-button ${isActive ? 'active' : ''}`}
                >
                  <IconComponent className="sidebar-icon" />
                  <span className="sidebar-text">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout-button" onClick={onLogout}>
          <span className="sidebar-icon">
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span className="sidebar-text">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );
}
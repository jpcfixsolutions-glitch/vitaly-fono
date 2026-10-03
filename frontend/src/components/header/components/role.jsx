import { BriefcaseBusiness } from 'lucide-react';

import './role.css';

// ToDo: cambiar el nombre y la posición por el nombre y la posición del usuario logueado
export const Role = ({ name = "", lastName = "", role = "" }) => {
  return (
    <div className="header-role">
      <BriefcaseBusiness size={20} className="header-role-icon" />
      <div className="header-role-info">
        <span className="header-role-name">{name + " " + lastName}</span>
        <span className="header-role-position">Rol: {role.toString()}</span>
      </div>
    </div>
  );
}
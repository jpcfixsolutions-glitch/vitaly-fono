import { IconSection } from '../../ui/iconSection';

import './section.css'

/**
 * Componente para crear secciones en la página
 * @param {Object} props - Propiedades del componente
 * @param {React.Component} props.Icon - Componente de icono (opcional)
 * @param {string} props.title - Título de la sección
 * @param {string} props.description - Descripción de la sección
 * @param {React.ReactNode} [props.actions] - Acciones opcionales alineadas a la derecha del título
 * @param {React.ReactNode} props.children - Contenido de la sección
 * @returns {JSX.Element} Componente de sección con título y descripción
 */
export const Section = ({ Icon, title, description, actions, children }) => {
  return (
    <section className="section-container">
      <div className="section-icon-container-desktop">
        {Icon && (
          <IconSection Icon={Icon} size={24} />
        )}
        <div className="section-title-container">
          <h2 className="section-title">{title}</h2>
          <p className="section-description">{description}</p>
        </div>
        {actions && <div className="section-actions">{actions}</div>}
      </div>
      <div className="section-icon-container-mobile">
        <div className="section-title-container">
          {Icon && (
            <IconSection Icon={Icon} size={18} />
          )}
          <h2 className="section-title">{title}</h2>
          {actions && <div className="section-actions">{actions}</div>}
        </div>
        <p className="section-description">{description}</p>
      </div>
      {children && (
        <div className="section-content">
          {children}
        </div>
      )}
    </section>
  );
};

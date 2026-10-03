import './iconSection.css';

/**
 * Componente para mostrar un icono en el titulo de una sección
 * @param {React.Component} Icon - Componente de icono
 * @param {number} size - Tamaño del icono
 * @returns 
 */
export const IconSection = ({ Icon, size = 24 }) => {
  return (
    <div className="section-icon">
      <Icon size={size} />
    </div>
  );
};
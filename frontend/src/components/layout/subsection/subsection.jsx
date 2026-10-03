import './subsection.css';

/**
 * Componente para crear subsecciones en la página
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la subsección
 * @param {string} props.description - Descripción de la subsección
 * @param {React.ReactNode} props.children - Contenido de la subsección
 * @returns {JSX.Element} Componente de subsección con título y descripción
 */
export const Subsection = ({ title, description, children, target = "#" }) => {

  const normalizedId = typeof target === 'string'
    ? (target.startsWith('#') ? target.slice(1) : target)
    : undefined;

  return (
    <>
      <section className="subsection" id={normalizedId}>
        <h3 className="subsection-title">{title}</h3>
        <p className="subsection-description">{description}</p>
        {children}
      </section>
    </>
  );
}
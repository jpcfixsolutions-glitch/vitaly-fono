import './messageSuccess.css';

/**
 * Componente para mostrar un mensaje de éxito.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {string} props.message - El mensaje de éxito a mostrar.
 * @param {string} [props.className=""] - Clases CSS adicionales para el contenedor.
 * @returns {JSX.Element} Elemento JSX que representa el mensaje de éxito.
 */
export const MessageSuccess = ({ message, className = "" }) => {
  return (
    <div className={`message-success ${className}`}>
      {message}
    </div>
  );
}
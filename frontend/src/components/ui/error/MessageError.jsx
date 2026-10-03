import './messageError.css';

/**
 * Componente para mostrar un mensaje de error.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {string} props.message - El mensaje de error a mostrar.
 * @param {string} [props.className=""] - Clases CSS adicionales para el contenedor.
 * @returns {JSX.Element} Elemento JSX que representa el mensaje de error.
 */
export const MessageError = ({ message, className = "" }) => {
  return (
    <div className={`message-error ${className}`}>
      {message}
    </div>
  );
};
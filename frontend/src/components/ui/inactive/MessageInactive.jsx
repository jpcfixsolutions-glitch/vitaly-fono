import './messageInactive.css';

/**
 * Componente para mostrar un mensaje de paciente inactivo.
 *
 * @component
 * @param {string} message - El mensaje a mostrar.
 * @param {string} className - Clases CSS adicionales para el contenedor.
 * @returns {JSX.Element} Elemento JSX que representa el mensaje de paciente inactivo.
 */
export const MessageInactive = ({ message = "" }) => {
  return (
    <div className={`mt-0 mb-3 p-2 text-center message-inactive`}>
      {message}
    </div>
  );
};
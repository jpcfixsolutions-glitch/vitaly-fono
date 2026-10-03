import React from 'react';

/**
 * Componente para enviar mensajes de WhatsApp
 * @param {Object} props
 * @param {string} props.phoneNumber - Número de teléfono
 * @param {string} [props.message] - Mensaje personalizado
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {string} [props.buttonText] - Texto del botón
 * @param {string} [props.countryCode='54'] - Código de país
 * @param {() => void} [props.onClick] - Callback adicional al hacer clic
 */
export const WhatsAppButton = ({
  phoneNumber,
  message = '',
  className = 'btn btn-success',
  disabled = false,
  buttonText = '',
  countryCode = '54',
  onClick
}) => {
  const handleWhatsAppClick = () => {
    if (!phoneNumber) return;

    // Convertir a string y limpiar el número de teléfono (remover espacios, guiones, etc.)
    const phoneString = String(phoneNumber);
    const cleanPhone = phoneString.replace(/\D/g, '');

    // Validar que el número limpio no esté vacío
    if (!cleanPhone) return;

    // Agregar código de país si no lo tiene
    const phoneWithCountryCode = cleanPhone.startsWith(countryCode) ? cleanPhone : `${countryCode}${cleanPhone}`;

    // Crear el mensaje codificado para URL
    const defaultMessage = 'Hola, te contacto desde el consultorio médico.';
    const finalMessage = message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);

    // Abrir WhatsApp Web/App
    const whatsappUrl = `https://wa.me/${phoneWithCountryCode}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Ejecutar callback adicional si se proporciona
    if (onClick) {
      onClick();
    }
  };

  // No renderizar si no hay número de teléfono
  if (!phoneNumber) return null;

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={handleWhatsAppClick}
      title={`Enviar mensaje de WhatsApp a ${phoneNumber}`}
    >
      <i className="fab fa-whatsapp"></i>
      {buttonText}
    </button>
  );
};

export const isValidPassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos una letra minúscula." };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos una letra mayúscula." };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos un número." };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos un carácter especial." };
  }

  return { isValid: true, message: "" };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un valor es un string válido para nombres o textos:
 * - Solo acepta strings no vacíos, no solo espacios, no números, no null/undefined, no solo caracteres especiales.
 * - Debe contener al menos una letra (incluyendo tildes, Ñ, etc).
 *
 * @param {*} value - El valor a validar.
 * @returns {boolean} true si el valor es un string válido siguiendo los criterios establecidos, false en caso contrario.
 */
export const isValidString = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (/^[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(trimmed)) return false;
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(trimmed)) return false;
  return true;
};

export const isValidAge = (age) => {
  if (parseInt(age) < 0) return false;
  return true;
};
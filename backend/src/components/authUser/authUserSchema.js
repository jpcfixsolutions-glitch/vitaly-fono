import { object, string, email, minLength, pipe, regex, optional, check } from 'valibot';

export const RegisterSchema = object({
  name: pipe(
    string("El nombre debe ser texto"),
    minLength(1, "El nombre es obligatorio")
  ),
  last_name: pipe(
    string("El apellido debe ser texto"),
    minLength(1, "El apellido es obligatorio")
  ),
  id_rol: string("El rol es obligatorio"),
  email: pipe(
    string("El email es obligatorio"),
    email("El formato del email es inválido")
  ),
  password: pipe(
    string("La contraseña es obligatoria"),
    minLength(8, "La contraseña debe tener al menos 8 caracteres"),
    regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula"),
    regex(/[a-z]/, "La contraseña debe tener al menos una minúscula"),
    regex(/[0-9]/, "La contraseña debe tener al menos un número"),
    regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "La contraseña debe tener al menos un carácter especial")
  )
});

export const UpdateUserSchema = pipe(
  object({
    name: optional(pipe(
      string("El nombre debe ser texto"),
      minLength(1, "El nombre no puede estar vacío")
    )),
    last_name: optional(pipe(
      string("El apellido debe ser texto"),
      minLength(1, "El apellido no puede estar vacío")
    )),
    id_rol: optional(string("El Rol debe ser válido")),
    email: optional(pipe(
      string("El email debe ser texto"),
      email("El formato del email es inválido")
    )),
    status: optional(string("El estado debe ser válido")),
    password: optional(pipe(
      string(),
      minLength(8, "La contraseña debe tener al menos 8 caracteres"),
      regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula"),
      regex(/[a-z]/, "La contraseña debe tener al menos una minúscula"),
      regex(/[0-9]/, "La contraseña debe tener al menos un número"),
      regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "La contraseña debe tener al menos un carácter especial")
    )),
    confirmPassword: optional(string())
  }),
  // Validación Cruzada: Solo si hay password, validamos que coincida con confirmPassword
  check((input) => {
    if (input.password && input.password !== input.confirmPassword) {
      return false;
    }
    return true;
  }, "Las contraseñas no coinciden")
);

export const LoginSchema = object({
  email: pipe(string(), email("Email inválido")),
  password: pipe(string(), minLength(1, "Ingresa tu contraseña")) 
});
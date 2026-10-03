import apiClient from './apiClient';

// Decodifica el token JWT manejando correctamente Base64URL y UTF-8
// Nota: atob devuelve una cadena Latin-1; convertimos a bytes y luego a UTF-8
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    // JWT usa Base64URL, convertir a Base64 estándar
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decodificar a binario y mapear a bytes
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    // Decodificar bytes UTF-8 a texto y parsear JSON
    const jsonText = new TextDecoder().decode(bytes);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });

  if (response.data.data.accessToken) {
    const accessToken = response.data.data.accessToken;
    const privileges = response.data.data.privileges || [];
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('privileges', JSON.stringify(privileges));
      const userData = decodeToken(accessToken);
      if (userData) {
        const user = {
          id: userData.userId,
          email: userData.email,
          id_rol: userData.id_rol,
          role: userData.role,
          name: userData.name,
          lastName: userData.lastName
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { user, token: accessToken, privileges };
      }
    }
  }
  return null;
};

const logout = async () => {
  try {
    // Llama al backend para invalidar el refresh token
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.warn("Error en el logout del backend, limpiando localmente:", error);
  } finally {
    // Siempre limpia el almacenamiento local
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

export const authService = {
  login,
  logout,
};
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 1. Interceptor de Petición (Request)
// Se ejecuta ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Respuesta (Response)
// Se ejecuta DESPUÉS de recibir una respuesta.
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, solo devuélvela
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401/403 (Token Expirado/Inválido) Y no es un reintento
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca esto como un reintento

      try {
        // Llama a tu endpoint /refresh para obtener un nuevo token
        const { data } = await apiClient.post('/auth/refresh');

        // Guarda el nuevo token
        const newAccessToken = data.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Actualiza el header de la petición original
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Reintenta la petición original con el nuevo token
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Si el refresh falla (ej. refresh token expiró),
        // borramos todo y forzamos el logout.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Redirigir a login (opcional, el AuthContext también lo hará)
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
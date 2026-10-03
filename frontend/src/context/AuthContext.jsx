import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Loading } from '../components';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [privileges, setPrivileges] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- 1. RENOMBRAMOS LOS ESTADOS DE CARGA ---
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Para la carga inicial de la App
  const [isActionLoading, setIsActionLoading] = useState(false); // Para el botón de Login

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const storedPrivs = JSON.parse(localStorage.getItem('privileges') || '[]');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setPrivileges(storedPrivs);
      setIsAuthenticated(true);
    }
    // Solo la carga inicial desactiva el loader GLOBAL
    setIsAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    // --- 2. USAMOS EL LOADER DE ACCIÓN ---
    setIsActionLoading(true);
    try {
      const result = await authService.login(email, password);

      if (result) {
        const { user, token, privileges } = result;
        setUser(user);
        setToken(token);
        setPrivileges(privileges);
        setIsAuthenticated(true);
        setIsActionLoading(false); // <-- Se desactiva en éxito
        return { success: true };
      } else {
        throw new Error("Respuesta de login inválida.");
      }
    } catch (error) {
      setIsActionLoading(false); // <-- Se desactiva en error
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión"
      };
    }
  };

  const logout = async () => {
    // (Tu función de logout es perfecta)
    await authService.logout();
    setUser(null);
    setToken(null);
    setPrivileges([]);
    setIsAuthenticated(false);
  };

  // --- 3. EL LOADER GLOBAL SOLO SE FIJA EN 'isAuthLoading' ---
  if (isAuthLoading) {
    return <Loading className="loading-container" />;
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      privileges,
      isAuthenticated,
      isLoading: isActionLoading, // <-- 4. Pasamos el loader de ACCIÓN como 'isLoading'
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
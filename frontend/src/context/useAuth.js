import { useContext } from 'react';
import { AuthContext } from './authContext';

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};


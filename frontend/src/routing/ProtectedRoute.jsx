import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Unauthorized from '../pages/Unauthorized';

export function ProtectedRoute({ children, requiredPrivileges = [] }) {
  const { isAuthenticated, privileges = [] } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPrivileges.length > 0) {
    const hasPermission = requiredPrivileges.some((p) => privileges.includes(p));
    if (!hasPermission) {
      return <Unauthorized requiredPrivileges={requiredPrivileges} />;
    }
  }

  return children;
}
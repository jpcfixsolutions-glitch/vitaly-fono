import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import {
  Home,
  ConfigureParameters,
  Header,
  Sidebar,
  Calendar,
  ManagePatients,
  ManagePayments,
  Login,
  Users,
  ManageClinicalHistory,
  Roles
} from './components';

import './App.css';

import { useSidebarState } from './hooks/useSidebarState';
import { useResponsiveSidebar } from './hooks/useResponsiveSidebar';

import { ProtectedRoute } from './routing/ProtectedRoute';
import { ROUTE_PRIVILEGES } from './routing/routePrivileges';

function App() {
  const { isAuthenticated, logout, user } = useAuth();

  const { isSidebarOpen, setIsSidebarOpen } = useSidebarState();
  const { isMobile } = useResponsiveSidebar({ isSidebarOpen, setIsSidebarOpen });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='app-container'>
      {isAuthenticated && (
        <>
          <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <Sidebar userName={user?.name || "Usuario"} onLogout={handleLogout} />
          </aside>

          {isMobile && isSidebarOpen && (
            <div className="sidebar-overlay" onClick={toggleSidebar} />
          )}
        </>
      )}

      <main className={`main-content ${isAuthenticated && !isMobile && !isSidebarOpen ? 'sidebar-closed' : ''}`}>
        {isAuthenticated && (
          <Header
            userName={user?.name || "Nombre"}
            lastName={user?.lastName || "Apellido"}
            role={user?.role || "Rol"}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}

        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated
                ? <Login />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home userName={user?.name || "Usuario"} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendario"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.CALENDAR]}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-pacientes"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.PATIENTS]}>
                <ManagePatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.SETTINGS]}>
                <ConfigureParameters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/administrar-cobros"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.PAYMENTS]}>
                <ManagePayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-usuarios"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.USERS]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestionar-roles"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.ROLES]}>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historias-clinicas"
            element={
              <ProtectedRoute requiredPrivileges={[ROUTE_PRIVILEGES.CLINICAL_HISTORY]}>
                <ManageClinicalHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes >
      </main >
    </div >
  );
}

export default App;
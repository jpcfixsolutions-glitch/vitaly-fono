import { Link } from 'react-router-dom';
import './unauthorized.css';

export default function Unauthorized({ requiredPrivileges = [] }) {
  return (
    <>
      <div className="margin-top"></div>
      <div className="funcionality-container">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">No tienes permisos</h4>
            <p className="mb-2">
              Tu usuario no tiene permisos para acceder a esta sección.
            </p>
            {requiredPrivileges.length > 0 && (
              <p className="mb-0">
                <strong>Permiso requerido:</strong> {requiredPrivileges.join(' / ')}
              </p>
            )}
          </div>

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-unauthorized">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
      <div className="margin-bottom"></div>
    </>
  );
}
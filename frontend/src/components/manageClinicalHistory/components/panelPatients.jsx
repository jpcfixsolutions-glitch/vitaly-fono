import { User } from "lucide-react";
import { Search } from "lucide-react";
import { Loading } from "../../ui/loading";
import { PatientList } from "./PatientList";

/**
 * PanelPatients
 *
 * Componente lateral de gestión de pacientes. Permite:
 *   - Visualizar el listado de pacientes activos/inactivos.
 *   - Filtrar pacientes por estado (activo/inactivo) y por texto de búsqueda (nombre o apellido).
 *   - Indica el número de pacientes filtrados.
 *   - Permite seleccionar un paciente para ver o editar su historia clínica.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.filteredPatients - Lista de pacientes ya filtrados (por estado y búsqueda)
 * @param {'active'|'inactive'} props.statusFilter - Filtro de estado seleccionado ("active" o "inactive")
 * @param {function(string):void} props.setStatusFilter - Función para cambiar el filtro de estado
 * @param {string} props.searchTerm - Texto actual de búsqueda de pacientes
 * @param {function(string):void} props.setSearchTerm - Función para actualizar el término de búsqueda
 * @param {boolean} props.loading - True si están cargando los pacientes (muestra loading)
 * @param {Object|null} props.selectedPatient - Paciente actualmente seleccionado o null
 * @param {function(Object):void} props.setSelectedPatient - Función para setear el paciente seleccionado
 */
export const PanelPatients = ({ 
  filteredPatients, 
  statusFilter, 
  setStatusFilter, 
  searchTerm, 
  setSearchTerm,
  loading,
  selectedPatient,
  setSelectedPatient,
}) => {

  // Panel lateral de pacientes: muestra búsqueda, filtrado y lista de selección.
  return (
    <div className="patient-list-panel">
      <div className="patient-list-header">
        <div className="patient-list-header-top">
          <div className="patient-list-title">
            <User className="patient-list-icon" />
            <h3>Pacientes</h3>
            <span className="patient-count-badge">{filteredPatients.length}</span>
          </div>
          <select
            className="patient-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div className="patient-search-wrapper">
          <Search className="patient-search-icon" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="patient-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="patient-list-content">
        {loading ? (
          <Loading className="table-container-loading" />
        ) : (
          <PatientList
            patients={filteredPatients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            disabled={loading}
            onViewInterview={(patient) => {
              setSelectedPatient(patient);
            }}
          />
        )}
      </div>
    </div>
  );
};
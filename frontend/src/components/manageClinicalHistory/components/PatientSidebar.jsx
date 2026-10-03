import React, { useState, useMemo } from 'react';
import { User, Search } from 'lucide-react';
import { Loading } from '../../loading';
import { PatientList } from './PatientList';

export const PatientSidebar = ({ 
  patients, 
  selectedPatient, 
  onSelectPatient, 
  loading, 
  loadingInterview,
  onViewInterview 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');

  const filteredPatients = useMemo(() => {
    const byName = patients.filter(patient =>
      `${patient.nombre} ${patient.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter === 'active') {
      return byName.filter(p => p.status === 'Activo' || p.status === true);
    }
    if (statusFilter === 'inactive') {
      return byName.filter(p => p.status === 'Inactivo' || p.status === false);
    }
    return byName;
  }, [patients, searchTerm, statusFilter]);

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
            onSelectPatient={onSelectPatient}
            disabled={loading || loadingInterview}
            onViewInterview={onViewInterview}
            loadingInterview={loadingInterview}
          />
        )}
      </div>
    </div>
  );
};
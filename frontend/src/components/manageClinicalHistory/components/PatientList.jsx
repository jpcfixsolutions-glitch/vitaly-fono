import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { calculateAge } from '../../../utils/age';
import { getInitials } from '../utils/getInitials';

export const PatientList = ({ 
  patients, 
  selectedPatient, 
  onSelectPatient, 
  disabled = false, 
}) => {

  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedPatient && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedPatient]);

  return (
    <>
      {patients.length === 0 && (
        <div className="patient-list-empty text-center">
          <p className="text-muted mt-4">No se encontraron pacientes</p>
        </div>
      )}
      {patients.map((patient) => {

        const isSelected = selectedPatient?.id === patient.id;

        return (
          <div
            key={patient.id}
            ref={isSelected ? selectedRef : null}
            onClick={() => !disabled && onSelectPatient(patient)}
            aria-disabled={disabled}
            className={`patient-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          >
            <div className="patient-card-header">
              <div className="patient-card-avatar">
                {getInitials(patient)}
              </div>
              <div className="patient-card-info">
                <p className="patient-card-name">
                  {patient.name} {patient.last_name}
                </p>
                <p className="patient-card-age">{calculateAge(patient.birth_date)}</p>
              </div>
            </div>

            <div className="patient-card-details">
              <div className="patient-card-detail-row">
                <span>Última sesión:</span>
                <span>
                  {patient.last_session 
                    ? format(new Date(patient.last_session), "dd/MM/yyyy") 
                    : 'Sin datos'}
                </span>
              </div>
              <div className="patient-card-detail-row">
                <span>Total sesiones:</span>
                <span>{typeof patient.totalSesiones === 'number' ? patient.totalSesiones : 'Sin datos'}</span>
              </div>

              {patient.have_first_interview === false && (
                <div className="patient-card-no-interview">
                  Sin entrevista inicial
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

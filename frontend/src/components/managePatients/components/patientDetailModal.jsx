import { calculateAge, formatDateDisplay } from '../utils';
import './patientDetailModal.css';

/**
 * Componente para mostrar un ítem de detalle (label + valor)
 */
const DetailItem = ({ label, value, className = '', children }) => (
  <div className={`detail-item ${className}`}>
    <label>{label}</label>
    {children ? children : <p>{value || '-'}</p>}
  </div>
);

/**
 * Componente para mostrar una sección de detalles con encabezado e icono
 */
const DetailSection = ({ icon, title, children }) => (
  <div className="detail-section">
    <div className="detail-section__header">
      <i className={`fa ${icon}`}></i>
      <h6>{title}</h6>
    </div>
    <div className="detail-grid">
      {children}
    </div>
  </div>
);

/**
 * PatientDetailModal
 * ------------------
 * Componente que muestra un modal con la información completa de un paciente.
 * Utiliza subcomponentes para organizar la visualización.
 */
export const PatientDetailModal = ({ patient }) => {
  // Variables derivadas seguras (incluso si patient es null)
  const dateField = patient?.birth_date || patient?.fecha_nacimiento;
  const age = calculateAge(dateField);
  const formattedDate = formatDateDisplay(dateField);
  const birthDateDisplay = `${formattedDate} ${age !== '-' ? `(${age})` : ''}`;
  const isActive = patient?.status === 'Activo';

  return (
    <div className="modal fade" id="patientDetailModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content patient-detail-modal">
          
          {/* Header */}
          <div className="patient-detail-header">
            <div className="patient-detail-header__icon">
              <i className="fa fa-user-circle"></i>
            </div>
            <div className="patient-detail-header__content">
              <h5 className="patient-detail-header__title">Datos del paciente</h5>
              <p className="patient-detail-header__subtitle">Información general y de contacto</p>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          {/* Body */}
          <div className="modal-body patient-detail-body">
            {!patient ? (
              <div className="text-center p-3 text-muted">
                <p>No hay información disponible.</p>
              </div>
            ) : (
              <>
                {/* Información Personal */}
                <DetailSection icon="fa-id-card" title="Información Personal">
                  <DetailItem label="Nombre Completo" value={`${patient.name} ${patient.last_name}`} />
                  <DetailItem label="Tipo de Documento" value={patient.document_type} />
                  <DetailItem label="Fecha de Nacimiento" value={birthDateDisplay} />
                  <DetailItem label="Documento" value={patient.document_number} />
                </DetailSection>

                {/* Información de Contacto */}
                <DetailSection icon="fa-phone" title="Información de Contacto">
                  <DetailItem label="Teléfono" value={patient.phone} />
                  <DetailItem label="Email" value={patient.email} />
                  <DetailItem label="Dirección" value={patient.address} className="full-width" />
                </DetailSection>

                {/* Cobertura Médica */}
                <DetailSection icon="fa-shield-heart" title="Cobertura Médica">
                  <DetailItem label="Obra Social / Prepaga" value={patient.health_insurance} />
                  <DetailItem label="Estado del paciente">
                    <p className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </p>
                  </DetailItem>
                </DetailSection>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer patient-detail-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>

        </div>
      </div>
    </div>
  );
};

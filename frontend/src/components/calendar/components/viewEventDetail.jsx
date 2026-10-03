// ToDo: realmente no entiendo la lógica de este componente, pero solo maneja el cambio de estado del turno a través de onChangeStatus que lo recibe como prop del update que brinda calendar (del hook useUpdateTurn). Y acá crea un handler para cambiar el estado del turno, pero que internamente dispara ese trigger para el update del turno. Refactorizar este componente para que sea más claro y fácil de entender. Funcionalmente funciona, pero no es claro.

import { WhatsAppButton } from '../../ui/whatsapp/whatsappButton.jsx';
import './viewEventDetail.css'; // Asegúrate que la importación esté correcta
import { Loading } from '../../ui/loading/loading.jsx';
import { formatPhoneDisplay } from '../../../utils/format.js';
import { buildWhatsAppMessage } from '../utils/messages.js';
import { handleStatusChange } from '../handlers/handleStatusChange.js';
import { MessageError } from '../../ui/error/MessageError.jsx';

// Estados visibles en el front y sus estilos
// Claves front: programado, notificado, confirmado, cancelado
const statusConfig = {
  programado: { label: 'Programado', colorClass: 'activo', icon: 'fa fa-play-circle' },
  notificado: { label: 'Notificado', colorClass: 'pendiente', icon: 'fa fa-clock' },
  confirmado: { label: 'Confirmado', colorClass: 'confirmado', icon: 'fa fa-check-circle' },
  cancelado: { label: 'Cancelado', colorClass: 'cancelado', icon: 'fa fa-times-circle' }
};

// Backend -> Front
const mapBackendToFront = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'activo' || s === 'otorgado') return 'programado';
  if (s === 'notificado' || s === 'pendiente_confirmación' || s === 'pendiente_confirmacion') return 'notificado';
  if (s === 'confirmado') return 'confirmado';
  if (s === 'cancelado') return 'cancelado';
  return 'programado';
};

// Front -> Backend
export const mapFrontToBackend = (frontKey) => {
  switch (frontKey) {
    case 'programado': return 'Programado';
    case 'notificado': return 'Notificado';
    case 'confirmado': return 'Confirmado';
    case 'cancelado': return 'Cancelado';
    default: return 'Programado';
  }
};

export const ViewEventDetail = ({ 
  selectedEvent, 
  onChangeStatus, 
  loading = false, 
  errorMessage = '',
}) => {
  if (!selectedEvent) return null;

  const modalityClass = selectedEvent.modality?.toLowerCase() === 'virtual' ? 'virtual' : 'presencial';
  const modalityText = selectedEvent.modality || '-';

  const whatsAppMessage = buildWhatsAppMessage({
    name: selectedEvent?.name,
    fechaStr: selectedEvent?.fechaStr,
    horaStr: selectedEvent?.horaStr,
  });

  const currentStatusKey = mapBackendToFront(selectedEvent.status);
  const currentStatusConfig = statusConfig[currentStatusKey] || statusConfig.programado;

  // Mostrar label de estado actual (ya vienen en pasado)
  const currentStatusDisplayLabel = currentStatusConfig.label || currentStatusKey;

  return (
    <div className="event-detail-container">

      <div className="patient-info-section">
        <div className="patient-header">
          <div className="patient-icon-wrapper">
            <i className="fa fa-user"></i>
          </div>
          <div className="patient-name-details">
            <p className="label">Paciente</p>
            <p className="value">
              {selectedEvent.name || ''} {selectedEvent.last_name || ''}
            </p>
            {selectedEvent.psychologist_name && (
              <>
                <p className="label" style={{ marginTop: '0.5rem' }}>Profesional a cargo</p>
                <p className="value">{selectedEvent.psychologist_name}</p>
              </>
            )}
          </div>
          <div className="patient-whatsapp-button">
            <WhatsAppButton
              phoneNumber={selectedEvent?.phone || ''}
              message={whatsAppMessage}
              disabled={loading}
              className="btn btn-success wsp-button"
              onClick={() => {
                if (onChangeStatus && currentStatusKey !== 'notificado') {
                  onChangeStatus('Notificado');
                }
              }}
            />
          </div>
        </div>

        <div className="patient-details-grid">
          <div className="detail-item">
            <div className="icon-container-detail-turn">
              <i className="fa fa-phone"></i>
            </div>
            <div className="detail-text">
              <p className="label">Teléfono</p>
              <p className="value"><b>{formatPhoneDisplay(selectedEvent.phone)}</b></p>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-container-detail-turn">
              <i className="fa fa-calendar-alt"></i>
            </div>
            <div className="detail-text">
              <p className="label">Fecha</p>
              <p className="value"><b>{selectedEvent.fechaStr || '-'}</b></p>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-container-detail-turn">
              <i className="fa fa-clock"></i>
            </div>
            <div className="detail-text">
              <p className="label">Horario</p>
              <p className="value"><b>{selectedEvent.horaStr || '-'}</b></p>
            </div>
          </div>

          <div className="detail-item">
            <div className="icon-container-detail-turn">
              <i className={`fa ${modalityClass === 'virtual' ? 'fa-laptop' : 'fa-map-marker-alt'}`}></i>
            </div>
            <div className="detail-text">
              <p className="label">Modalidad</p>
              <p className="value"><b>{modalityText}</b></p>
            </div>
          </div>
        </div>
      </div>

      <div className="status-section">
        <div className="status-display-wrapper">
          <div className="status-current-group">
            <label className="status-select-label">Estado actual</label>
            <span className={`status-badge-display ${currentStatusConfig.colorClass}`}>
              {currentStatusDisplayLabel}
            </span>
          </div>

          <div className="status-select-group">
            <label htmlFor="status-select" className="status-select-label">Cambiar el estado del turno a...</label>
            <select
              id="status-select"
              className="form-select status-select-control"
              value={currentStatusKey}
              onChange={handleStatusChange(onChangeStatus, currentStatusKey)}
              disabled={loading}
            >
              {Object.entries(statusConfig)
                .filter(([statusKey]) => statusKey !== 'notificado') // Excluimos notificado porque se maneja por WhatsApp
                .map(([statusKey, config]) => (
                  <option key={statusKey} value={statusKey}>
                    {config.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {loading && <Loading className="loading-container-form" />}
        {errorMessage && <MessageError message={errorMessage} />}
      </div>
    </div>
    );
  };
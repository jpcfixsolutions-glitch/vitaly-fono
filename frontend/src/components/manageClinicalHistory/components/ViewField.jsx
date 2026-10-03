/**
 * Componente para mostrar un campo en modo solo lectura
 */
export const ViewField = ({ label, value, type = 'text' }) => {
  const displayValue = value || '-';
  
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <div className="form-control" style={{ 
          minHeight: '80px', 
          whiteSpace: 'pre-wrap',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          padding: '0.375rem 0.75rem'
        }}>
          {displayValue}
        </div>
      ) : (
        <div className="form-control" style={{ 
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          padding: '0.375rem 0.75rem',
          color: value ? '#212529' : '#6c757d'
        }}>
          {displayValue}
        </div>
      )}
    </div>
  );
};

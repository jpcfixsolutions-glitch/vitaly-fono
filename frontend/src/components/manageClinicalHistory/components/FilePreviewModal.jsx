import './filePreviewModal.css';

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  // Detecta si es Cloudinary (http...) o local
  const isAbsoluteUrl = file.path.startsWith('http');
  const baseUrl = "http://localhost:3000";
  let fileUrl = isAbsoluteUrl ? file.path : `${baseUrl}${file.path}`;

  // Forzar HTTPS para Cloudinary
  if (fileUrl.startsWith('http://')) {
    fileUrl = fileUrl.replace('http://', 'https://');
  }

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-content" onClick={e => e.stopPropagation()}>

        {/* --- CABECERA MEJORADA CON BOTONES --- */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '15px'
        }}>
          <h4 style={{ color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '20px' }}>
            {file.original_name}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Botón Abrir en Nueva Pestaña */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}
              title="Ver archivo original"
            >
              <i className="fa-solid fa-up-right-from-square"></i> Abrir
            </a>

            {/* Botón Cerrar (con estilos inline para asegurar que se vea bien aquí) */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                lineHeight: '1',
                cursor: 'pointer',
                padding: 0
              }}
            >
              &times;
            </button>
          </div>
        </div>
        {/* ------------------------------------- */}

        <div className="preview-body">
          {file.mimetype.startsWith('image/') ? (
            <img src={fileUrl} alt="Preview" className="preview-image" />
          ) : (
            <iframe src={fileUrl} title="PDF Preview" className="preview-iframe"></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
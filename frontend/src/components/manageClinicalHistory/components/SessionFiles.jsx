import React, { useState, useEffect } from 'react';
import { fileService } from '../../../services/fileService';
import { Loading } from '../../ui/loading';
import { MessageSuccess } from '../../ui/success/MessageSuccess';
import { MessageError } from '../../ui/error/MessageError';
import './sessionFiles.css';

const SessionFiles = ({ sessionId, onPreview, readOnly = false }) => {
  const [files, setFiles] = useState([]);

  // Estados Upload
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  // Estados Delete
  const [fileToDelete, setFileToDelete] = useState(null); // Si esto tiene datos, el modal se muestra
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState(null);

  useEffect(() => {
    if (sessionId) loadFiles();
  }, [sessionId]);

  const loadFiles = async () => {
    try {
      const response = await fileService.getFilesBySession(sessionId);
      if (response.data) setFiles(response.data);
    } catch (error) {
      console.error("Error cargando archivos", error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadFeedback(null);

    try {
      await fileService.uploadFile(sessionId, file);
      await loadFiles();
      setUploadFeedback({ type: 'success', text: '¡Archivo subido correctamente!' });
      setTimeout(() => setUploadFeedback(null), 3000);
    } catch (error) {
      console.error("Error subida", error);
      setUploadFeedback({ type: 'error', text: 'Error al subir el archivo.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Abre el modal manual (seteando el estado)
  const openDeleteModal = (e, file) => {
    e.stopPropagation();
    e.preventDefault();
    setFileToDelete(file);
    setDeleteFeedback(null);
  };

  // Cierra el modal manual
  const closeDeleteModal = () => {
    if (deleteLoading) return; // No cerrar si está cargando
    setFileToDelete(null);
    setDeleteFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    setDeleteLoading(true);
    try {
      await fileService.deleteFile(fileToDelete.id);
      setDeleteFeedback({ type: 'success', text: 'Eliminado correctamente.' });

      setTimeout(() => {
        closeDeleteModal();
        loadFiles();
      }, 1500);

    } catch (error) {
      console.error("Error eliminar", error);
      setDeleteFeedback({ type: 'error', text: 'No se pudo eliminar.' });
      // Si falla, dejamos que el usuario cierre o intente de nuevo
      setTimeout(() => setDeleteFeedback(null), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (readOnly && files.length === 0) return null;

  return (
    <>
    <div className="session-files-container mt-1" style={{ border: '1px solid #dee2e6', borderRadius: '10px', padding: '10px', backgroundColor: '#f8f9fa' }}>
      <h5 style={{ marginBottom: '15px', color: '#6c757d', fontSize: '.85rem' }}>
        Archivos adjuntos de la sesión
      </h5>

      <div className="files-grid">
        {!readOnly && files.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#adb5bd' }}>No hay archivos adjuntos.</p>
        )}

        {files.map(file => (
          <div
            key={file.id}
            className="file-chip"
            onClick={() => onPreview(file)}
            style={{ position: 'relative', paddingRight: !readOnly ? '30px' : '12px' }}
          >
            <span className="file-icon">
              {file.mimetype.includes('pdf') ? '📄' : '📷'}
            </span>
            <span className="file-name">{file.original_name}</span>

            {!readOnly && (
              <button
                type="button"
                onClick={(e) => openDeleteModal(e, file)}
                style={{
                  position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#dc3545',
                  cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', padding: '0 5px', lineHeight: '1'
                }}
                title="Eliminar"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="upload-section d-flex flex-column align-items-start mt-3 w-100">
          
          {/* Mensajes de Feedback */}
          {uploadFeedback?.type === 'success' && (
            <div className="mb-2 w-100">
              <MessageSuccess message={uploadFeedback.text} />
            </div>
          )}
          {uploadFeedback?.type === 'error' && (
            <div className="mb-2 w-100">
              <MessageError message={uploadFeedback.text} />
            </div>
          )}

          {/* Loader visible mientras sube */}
          {uploading && (
            <div className="mb-2 d-flex align-items-center justify-content-center gap-2 text-center">
              <Loading className="mini-loading text-center" />
              <span className="text-muted small">Procesando subida...</span>
            </div>
          )}

          <input
            type="file"
            id={`upload-${sessionId}`}
            style={{ display: 'none' }}
            onChange={handleUpload}
            accept="image/*,application/pdf"
            disabled={uploading}
          />
          <label 
            htmlFor={`upload-${sessionId}`} 
            className={`btn-upload-file ${uploading ? 'disabled' : ''}`}
          >
            {uploading ? "Subiendo..." : "Adjuntar archivo"}
          </label>

        </div>
      )}

      {/* --- MODAL MANUAL DE BORRADO (estilo unificado) --- */}
      {fileToDelete && (
        <div className="custom-modal-overlay" onClick={closeDeleteModal}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="deleteFileTitle">
            <div className="custom-modal-header">
              <h5 className="custom-modal-title" id="deleteFileTitle">Eliminar archivo</h5>
            </div>

            <div className="custom-modal-body">
              {deleteLoading ? (
                <div className="modal-feedback-container">
                  <Loading className="mini-loading" />
                  <p>Eliminando...</p>
                </div>
              ) : deleteFeedback ? (
                <div className="modal-feedback-container">
                  <p className={deleteFeedback.type === 'success' ? 'text-success' : 'text-danger'}>
                    <strong>{deleteFeedback.text}</strong>
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0 }}>
                  ¿Está seguro que desea eliminar el archivo <strong>{fileToDelete.original_name}</strong>?
                </p>
              )}
            </div>

            <div className="custom-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              {!deleteFeedback && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Eliminando..." : "Eliminar"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    {!readOnly && (
        <div className="col-12 mt-2">
        <span className="text-muted text-center" style={{ fontSize: '0.85rem' }}>* Nota:
            No es necesario apretar en "Guardar cambios" para cuando los archivos se eliminen o se suban.</span>
        </div>
      )}
    </>
  );
};

export default SessionFiles;
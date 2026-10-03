
import './modalGet.css'

/**
 * Modal genérico de visualización (GET)
 * @param {Object} props
 * @param {string} props.id - ID único del modal
 * @param {string} props.title - Título del modal
 * @param {React.ReactNode} props.children - Contenido de solo lectura
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {() => void} [props.onCancel] - Acción al cancelar/cerrar
 * @param {() => void} [props.onEdit] - Acción al presionar Editar
 */
export const ModalGet = ({
  id,
  title,
  children,
  className = "",
  onCancel,
}) => {
  return (
    <>
      <div className="modal fade" id={id} aria-hidden="true" aria-labelledby={`${id}Label`} tabIndex={-1}>
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${className}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



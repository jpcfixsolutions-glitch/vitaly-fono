import { ButtonInfo, ButtonIcon } from '../../'; // Assuming these are in component root
import { ClipboardList } from 'lucide-react';

/**
 * Componente que renderiza las acciones disponibles para cada fila de paciente:
 * - Ver detalle del paciente
 * - Editar paciente
 * - Ir a la historia clínica
 *
 * @component
 * @param {Object} props
 * @param {Object} props.row - Objeto de datos del paciente para la fila actual.
 * @param {Function} props.handleOpenView - Función para abrir el modal de detalle del paciente.
 * @param {Function} props.setUpdateData - Función para preparar la edición del paciente.
 * @param {Function} props.handleGoToClinicalHistory - Función para navegar a la historia clínica del paciente.
 * @returns {JSX.Element}
 */
export const RowActions = ({ row, handleOpenView, setUpdateData, handleGoToClinicalHistory }) => (
  <>
    <ButtonInfo
      id={String(row.id)}
      onClick={() => handleOpenView(row)}
      className="action-btn--info"
      dataBsToggle="modal"
      dataBsTarget="#patientDetailModal"
      iconSize={32}
    />
    <ButtonIcon
      id={String(row.id)}
      icon="fa-pen-to-square"
      parentMethod={() => setUpdateData(row)}
      dataBsToggle="modal"
      dataBsTarget={`#updatePatientModal`}
    />
    <button
      type="button"
      className="action-btn--history btn-info"
      title="Ver historia clínica"
      onClick={() => handleGoToClinicalHistory(row)}
    >
      <ClipboardList size={28} />
    </button>
  </>
);


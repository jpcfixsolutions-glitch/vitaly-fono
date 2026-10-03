import { Trash } from "lucide-react";

export const ButtonDelete = ({ id, onClick, className = "", iconSize = 48, iconStyle = { height: '20px', width: '20px' }, dataBsToggle, dataBsTarget }) => (
  <button
    className={`action-btn--delete btn-delete ${className}`}
    onClick={onClick}
    id={id}
    data-bs-toggle={dataBsToggle}
    data-bs-target={dataBsTarget}
  >
    <Trash size={iconSize} data-testid="delete-icon" style={iconStyle} />
  </button>
);

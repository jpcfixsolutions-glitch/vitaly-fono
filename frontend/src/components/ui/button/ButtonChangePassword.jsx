import { KeyRound } from "lucide-react";

export const ButtonChangePassword = ({ id, onClick, title = "Cambiar contraseña", className = "", iconSize = 48, iconStyle = { height: '18px', width: '18px' }, dataBsToggle, dataBsTarget }) => (
  <button
    className={`button-icon action-btn--change-password btn-change-password ${className}`}
    onClick={onClick}
    id={id}
    data-bs-toggle={dataBsToggle}
    data-bs-target={dataBsTarget}
    title={title}
  >
    <span className="d-flex align-items-center justify-content-center">
      <KeyRound size={iconSize} data-testid="change-password-icon" style={iconStyle} />
    </span>
  </button>
);


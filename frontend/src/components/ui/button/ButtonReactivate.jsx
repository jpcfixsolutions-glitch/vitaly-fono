import { CircleArrowUp } from "lucide-react";

export const ButtonReactivate = ({ onClick, title = "Reactivar", className = "", iconSize = 48, iconStyle = { height: '20px', width: '20px' }, ...otherProps }) => (
  <button
    className={`action-btn--reactivate btn-reactivate ${className}`}
    onClick={onClick}
    title={title}
    {...otherProps}
  >
    <CircleArrowUp size={iconSize} data-testid="reactivate-icon" style={iconStyle} />
  </button>
);

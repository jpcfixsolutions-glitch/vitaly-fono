import { CircleArrowUp } from "lucide-react";

export const ButtonDeactivate = ({
  id,
  onClick,
  className = "",
  iconSize = 48,
  iconStyle = { transform: 'rotate(180deg)', height: '20px', width: '20px' },
  dataBsToggle,
  dataBsTarget,
  IconComponent,
  disabled = false,
}) => (
  <button
    className={`action-btn--deactivate btn-deactivate ${className}`}
    onClick={onClick}
    id={id}
    data-bs-toggle={dataBsToggle}
    data-bs-target={dataBsTarget}
    disabled={disabled}
  >
    {IconComponent
      ? <IconComponent size={iconSize} data-testid="deactivate-icon" />
      : <CircleArrowUp size={iconSize} data-testid="deactivate-icon" style={iconStyle} />}
  </button>
);

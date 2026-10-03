import { Info } from "lucide-react";

export const ButtonInfo = ({
  id,
  onClick,
  className = "",
  iconSize = 48,
  dataBsToggle,
  dataBsTarget,
}) => (
  <button
    className={`action-btn--info btn-info ${className}`}
    onClick={onClick}
    id={id}
    data-bs-toggle={dataBsToggle}
    data-bs-target={dataBsTarget}
  >
    <Info size={iconSize} data-testid="info-icon" />
  </button>
);



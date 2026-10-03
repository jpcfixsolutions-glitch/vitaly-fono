import { AlertCircle } from "lucide-react";

export const DateErrorNotice = ({
  message = "La fecha de inicio no puede ser posterior a la fecha final",
  iconSize = 16,
}) => (
  <div className="date-error">
    <AlertCircle size={iconSize} />
    <span>{message}</span>
  </div>
);



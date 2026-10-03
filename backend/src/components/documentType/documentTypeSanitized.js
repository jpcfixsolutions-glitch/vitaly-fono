import { getCurrentDate } from "../../utils/date.js";

export const documentTypeSanitized = (name, status = "Activo", id_user) => {
  const objectSanitized = {
    name,
    status,
    id_user,
    created_at: getCurrentDate(),
    updated_at: getCurrentDate(),
  };

  return { objectSanitized };
};


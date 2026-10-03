import { getCurrentDate } from "../../utils/date.js";

export const healthInsuranceSanitized = (name, id_user, status = "Activo", mode = "create") => {
    let objectSanitized = {};

    if (mode === "create") {
        objectSanitized = {
            name,
            status,
            id_user,
            created_at: getCurrentDate(),
            updated_at: getCurrentDate(),
        }
    }
    else if (mode === "update") {
        objectSanitized = {
            name,
            status,
            id_user,
            updated_at: getCurrentDate(),
        }
    }
    return { objectSanitized };
}
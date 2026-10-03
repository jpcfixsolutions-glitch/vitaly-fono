import { getCurrentDate } from "../../utils/date.js";

export const typeServiceSanitized = (name, description, price, id_user, status, mode = "create") => {
    let objectSanitized = {};

    if (mode === "create") {
        objectSanitized = {
            name,
            description,
            price: Number(price),
            id_user,
            status: "Activo",
            created_at: getCurrentDate(),
            updated_at: getCurrentDate(),
        }
    }
    else if (mode === "update") {
        objectSanitized = {
            name,
            description,
            price: Number(price),
            status,
            id_user,
            updated_at: getCurrentDate(),
        }
    }
    return { objectSanitized };
}
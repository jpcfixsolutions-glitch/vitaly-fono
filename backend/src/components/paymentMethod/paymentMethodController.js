import { paymentMethodService } from "./paymentMethodService.js";
import { getCurrentDate } from "../../utils/date.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { paymentMethodValidations } from "./paymentMethodValidations.js";
import { paymentMethodSanitized } from "./paymentMethodSanitized.js";

const getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await paymentMethodService.getAllPaymentMethods();

    if (!paymentMethods || paymentMethods.length === 0) {
      return sendError(res, 404, "No se encontraron métodos de pago registrados", []);
    }

    return sendSuccess(res, "Métodos de pago obtenidos correctamente", paymentMethods);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

const getPaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentMethod = await paymentMethodService.getPaymentMethodById(id);

    if (!paymentMethod) {
      return sendError(res, 404, "No se encontró el método de pago buscado", []);
    }

    return sendSuccess(res, "Método de pago obtenido correctamente", paymentMethod);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

const createPaymentMethod = async (req, res) => {
  try {
    const { name, id_user } = req.body;

    await paymentMethodValidations(name, id_user);

    const paymentMethodExists = await paymentMethodService.getPaymentMethodByName(name, id_user);
    if (paymentMethodExists && paymentMethodExists.status === "Activo") {
      return sendError(res, 400, "El método de pago está activo", []);
    } else if (paymentMethodExists && paymentMethodExists.status === "Inactivo") {

      const { objectSanitized } = paymentMethodSanitized(name, id_user, "update");
    
      const result = await paymentMethodService.updatePaymentMethod(paymentMethodExists.id, objectSanitized);
      return sendSuccess(res, "Método de pago reactivado correctamente", result, 200);
    } else if (!paymentMethodExists) {
      const { objectSanitized } = paymentMethodSanitized(name, id_user, "create");
      const result = await paymentMethodService.createPaymentMethod(objectSanitized);
      return sendSuccess(res, "Método de pago creado correctamente", result, 201);
    }
  } catch (error) {
    return handleControllerError(res, error);
  }
}

const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const existsPaymentMethod = await paymentMethodService.getPaymentMethodById(id);
    if (!existsPaymentMethod) {
      return sendError(res, 404, "No se encontró el método de pago", []);
    }

    const { name, id_user } = req.body;

    await paymentMethodValidations(name, id_user);

    const paymentMethodExists = await paymentMethodService.getPaymentMethodByName(name, id_user);
    if (paymentMethodExists && paymentMethodExists.id !== id) {
      if (paymentMethodExists.status === "Activo") {
        return sendError(res, 400, "Ya existe un método de pago con ese nombre y está activo", []);
      }

      if (paymentMethodExists.status === "Inactivo") {
        return sendError(res, 400, `El método de pago "${name}" ya existe y está inactivo.`, []);
      }
    }

    const dataPaymentMethod = paymentMethodSanitized(name, id_user, "update");
    const result = await paymentMethodService.updatePaymentMethod(id, dataPaymentMethod.objectSanitized);
    return sendSuccess(res, "Método de pago actualizado correctamente", result);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

const deactivatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const existsPaymentMethod = await paymentMethodService.getPaymentMethodById(id);

    if (!existsPaymentMethod) {
      return sendError(res, 404, "No se encontró el método de pago", []);
    }

    await paymentMethodService.deactivatePaymentMethod(id);
    return sendSuccess(res, "Método de pago dado de baja correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export const paymentMethodController = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod
};
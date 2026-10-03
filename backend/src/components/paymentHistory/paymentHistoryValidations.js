import { userService } from "../user/userService.js";
import { sessionService } from "../session/sessionService.js";
import { patientService } from "../patient/patientService.js";
import { healthInsuranceService } from "../healthInsurance/healthInsuranceService.js";
import { paymentMethodService } from "../paymentMethod/paymentMethodService.js";
import { typeServiceService } from "../typeService/typeServiceService.js";
import { AppError } from "../../../errors.js";

export const paymentHistoryValidations = async (id_session, id_patient, id_health_insurance, id_payment_method, id_service, amount, notes, id_user) => {
  const normalizedAmount = typeof amount === "string" ? Number(amount) : amount;

  if (!id_session || !id_patient || !id_payment_method || !id_service || !id_user || normalizedAmount === undefined || normalizedAmount === null) {
    throw new AppError("Faltan datos obligatorios para crear el cobro", 400, []);
  }

  const existUser = await userService.getUserById(id_user);
  if (!existUser) {
    throw new AppError("No se encontró el usuario", 404, []);
  }

  const sessionExists = await sessionService.getSessionById(id_session);
  if (!sessionExists) {
    throw new AppError("No se encontró la sesión", 404, []);
  }

  const patientExists = await patientService.getPatientById(id_patient);
  if (!patientExists) {
    throw new AppError("No se encontró el paciente", 404, []);
  }

  if (id_health_insurance) {
    const healthInsuranceExists = await healthInsuranceService.getHealthInsuranceById(id_health_insurance);
    if (!healthInsuranceExists) {
      throw new AppError("No se encontró la obra social", 404, []);
    }
  }

  const paymentMethodExists = await paymentMethodService.getPaymentMethodById(id_payment_method);
  if (!paymentMethodExists) {
    throw new AppError("No se encontró el método de pago", 404, []);
  }

  const serviceExists = await typeServiceService.getTypeServiceById(id_service);
  if (!serviceExists) {
    throw new AppError("No se encontró el servicio", 404, []);
  }

  if (!Number.isFinite(normalizedAmount)) {
    throw new AppError("El monto debe ser un número", 400, []);
  }
  if (normalizedAmount <= 0) {
    throw new AppError("El monto debe ser mayor a 0", 400, []);
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    throw new AppError("Las notas deben ser un texto", 400, []);
  }
}
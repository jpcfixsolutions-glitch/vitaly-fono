import { patientService } from "../patient/patientService.js";
import { AppError } from "../../../errors.js";

export const patientDischargeValidations = async (id_patient, type, closing_reason) => {
  if (!id_patient || !type || !closing_reason) {
    throw new AppError("Faltan datos obligatorios para crear el cierre de tratamiento", 400, []);
  }

  const existingPatient = await patientService.getPatientById(id_patient);
  if (!existingPatient) {
    throw new AppError("Paciente no encontrado", 404, []);
  }
}
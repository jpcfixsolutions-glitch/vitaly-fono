import { patientService } from "../patient/patientService.js";
import { firstInterviewService } from "./firstInterviewService.js";
import { userService } from "../user/userService.js";
import { AppError } from "../../../errors.js";

export const firstInterviewValidations = async (id_patient, id_user) => {
  // Validamos que el paciente exista
  if (!id_patient) {
    throw new AppError("No se ha recibido el id del paciente", 400, []);
  }
  const patientExists = await patientService.getPatientById(id_patient);
  if (!patientExists) {
    throw new AppError("No se encontró el paciente", 404, []);
  }

  // Validamos que no exista ya una primera entrevista para el paciente
  const existing = await firstInterviewService.getFirstInterviewByPatientId(id_patient);
  if (existing) {
    throw new AppError(
      "Este paciente ya tiene una primera entrevista registrada. Ingresá a Editar entrevista para modificarla.",
      409,
      []
    );
  }

  // Validamos que el usuario exista
  if (!id_user) {
    throw new AppError("No se ha recibido el id del usuario", 400, []);
  }
  const userExists = await userService.getUserById(id_user);
  if (!userExists) {
    throw new AppError("No se encontró el usuario", 404, []);
  }
}

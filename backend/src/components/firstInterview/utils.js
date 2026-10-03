import { patientService } from "../patient/patientService.js";
import { getCurrentDate } from "../../utils/date.js";
import { AppError } from "../../../errors.js";

export const updatePatientData = async (id_patient, birth_date, address) => {
  try {
    const updatePatient = {
      birth_date,
      address,
      updated_at: getCurrentDate(),
    }
    await patientService.updatePatient(id_patient, updatePatient);
  } catch (error) {
    throw new AppError("Error al actualizar los datos del paciente", 500, []);
  }
}
import { firstInterviewService } from "../firstInterview/firstInterviewService.js";
import { AppError } from "../../../errors.js";

export const cohabitantValidations = async (id_interview) => {
  if (!id_interview) {
    throw new AppError("Faltan datos obligatorios para crear el registro de conviviente", 400, []);
  }

  const existsInterview = await firstInterviewService.getFirstInterviewById(id_interview);
  if (!existsInterview) {
    throw new AppError("No se encontró la primera entrevista", 404, []);
  }
};
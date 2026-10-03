import { parseDate } from "./date";

const parsePatient = (items) => {
  const parsed = items.map((patient) => {
    const documentTypeLabel = patient.document_type ?? patient.id_document_type ?? null;
    const healthInsuranceLabel = patient.health_insurance ?? patient.id_health_insurance ?? null;

    return {
      ...patient,
      document_type: documentTypeLabel,
      health_insurance: healthInsuranceLabel,
      birth_date: patient.birth_date ? parseDate(patient.birth_date).dateParsed : null,
    };
  });

  return parsed;
};

export { parsePatient };
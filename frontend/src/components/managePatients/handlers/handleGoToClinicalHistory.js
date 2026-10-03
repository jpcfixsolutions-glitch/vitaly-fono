export const handleGoToClinicalHistory = (navigate) => (row) => {
  if (!row?.id) return;

  navigate('/historias-clinicas', {
    state: { 
      selectedPatientId: row.id,
      patientStatus: row.status
    },
  });
};

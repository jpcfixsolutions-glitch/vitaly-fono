import { useMemo } from 'react';

/**
 * Hook personalizado que obtiene, filtra y enriquece la lista de pacientes para la gestión de historias clínicas.
 *
 * Este hook permite:
 *   - Filtrar pacientes por nombre y por estado ("active" o "inactive").
 *   - Enriquecer cada paciente con información extra:
 *       - `last_session`: fecha de la última sesión del paciente (o `null` si no tiene sesiones).
 *       - `totalSesiones`: cantidad total de sesiones del paciente.
 *       - `have_first_interview`: indica si el paciente tiene una primera entrevista registrada.
 *
 * @function useFilteredPatients
 * @param {Object} params - Parámetros de entrada.
 * @param {Array|Object} params.dataPatient - Lista de pacientes, o un objeto que contiene la lista en la propiedad `.data`.
 * @param {Array|Object} params.dataSessions - Lista de sesiones, o un objeto que contiene la lista en la propiedad `.data`.
 * @param {Array|Object} params.dataInterviews - Lista de entrevistas iniciales, o un objeto que contiene la lista en la propiedad `.data`.
 * @param {string} params.searchTerm - Texto de búsqueda para filtrar pacientes por nombre y/o apellido (case-insensitive).
 * @param {'active'|'inactive'} params.statusFilter - Estado a filtrar ("active" para activos, "inactive" para inactivos).
 *
 * @returns {Array<Object>} Lista de pacientes filtrados y enriquecidos. Cada objeto paciente contiene:
 *   - Todos los campos originales del paciente
 *   - last_session {string|null}: Fecha de la última sesión (string ISO o formato original, según datos de sesión)
 *   - totalSesiones {number}: Cantidad de sesiones asociadas
 *   - have_first_interview {boolean}: True si tiene registrada al menos una primera entrevista
 *
 * @example
 * const filteredPatients = useFilteredPatients({
 *   dataPatient,
 *   dataSessions,
 *   dataInterviews,
 *   searchTerm: "juan",
 *   statusFilter: "inactive"
 * });
 */
export const useFilteredPatients = ({
  dataPatient,
  dataSessions,
  dataInterviews,
  searchTerm,
  statusFilter,
}) => {
  return useMemo(() => {
    const patients = Array.isArray(dataPatient) ? dataPatient : (dataPatient?.data || []);
    const sessions = Array.isArray(dataSessions) ? dataSessions : (dataSessions?.data || []);
    const interviews = Array.isArray(dataInterviews) ? dataInterviews : (dataInterviews?.data || []);

    // Set de IDs de pacientes que tienen al menos una primera entrevista
    const patientsWithFirstInterview = new Set(
      interviews.map((interview) => String(interview.id_patient ?? interview.idPatient ?? ""))
    );

    return patients
      .filter((patient) => {
        // Filtro por nombre (usa los campos normalizados que ya vienen del backend)
        const fullName = `${patient.name ?? ''} ${patient.last_name ?? ''}`.toLowerCase();
        const matchesName = fullName.includes(searchTerm.toLowerCase());

        // Filtro por estado
        let matchesStatus = true;
        if (statusFilter === 'active') {
          matchesStatus = patient.status === 'Activo' || patient.status === true;
        } else if (statusFilter === 'inactive') {
          matchesStatus = patient.status === 'Inactivo' || patient.status === false;
        }

        return matchesName && matchesStatus;
      })
      .map((patient) => {
        // Sesiones del paciente (en backend es id_patient)
        const patientSessions = sessions.filter((s) => {
          const sessionPatientId = s.id_patient;
          return String(sessionPatientId) === String(patient.id);
        });

        // Última sesión (por fecha)
        const lastSession =
          patientSessions.length > 0
            ? patientSessions.reduce((latest, current) => {
                const currentDate = new Date(
                  current.session_date ?? current.fecha ?? current.sessionDate ?? 0
                );
                const latestDate = new Date(
                  latest.session_date ?? latest.fecha ?? latest.sessionDate ?? 0
                );
                return currentDate > latestDate ? current : latest;
              })
            : null;

        return {
          ...patient,
          last_session: lastSession
            ? lastSession.session_date ?? lastSession.fecha ?? lastSession.sessionDate
            : null,
          totalSesiones: patientSessions.length,
          have_first_interview: patientsWithFirstInterview.has(String(patient.id)),
        };
      });
  }, [dataPatient, dataSessions, dataInterviews, searchTerm, statusFilter]);
};


import { useApi } from "../../../hooks";

/**
 * Hook personalizado para actualizar un paciente en la API.
 * @param {Object} dataPatient - Objeto con el ID del paciente
 * @returns {Object} Objeto con funciones y estado de la petición
 * @property {Function} updatePatient - Función para actualizar un paciente
 * @property {boolean} loading - Estado de carga de la petición
 * @property {Error|null} error - Error ocurrido durante la petición
 */
export const useUpdatePatient = (dataPatient) => {
  const { trigger, loading, error } = useApi({
    id: dataPatient?.id,
    url: "/pacientes",
    method: "PATCH",
  });

  const updatePatient = async (data) => {
    try {
      const sanitizedData = {};

      if (data?.name !== undefined) sanitizedData.name = String(data.name).trim();
      if (data?.last_name !== undefined) sanitizedData.last_name = String(data.last_name).trim();
      if (data?.email !== undefined) sanitizedData.email = String(data.email).trim();
      if (data?.phone !== undefined) sanitizedData.phone = String(data.phone).toString().trim();
      if (data?.address !== undefined) sanitizedData.address = String(data.address).trim();
      if (data?.document_number !== undefined) sanitizedData.document_number = String(data.document_number).trim();
      if (data?.id_document_type !== undefined) sanitizedData.id_document_type = data.id_document_type;
      if (data?.id_health_insurance !== undefined) sanitizedData.id_health_insurance = data.id_health_insurance;
      if (data?.id_user !== undefined) sanitizedData.id_user = data.id_user;
      if (data?.birth_date !== undefined) sanitizedData.birth_date = data.birth_date;
      if (data?.status !== undefined) {
        if (typeof data.status === 'boolean') {
          sanitizedData.status = data.status ? "Activo" : "Inactivo";
        } else if (typeof data.status === 'string') {
          const normalized = data.status.toLowerCase();
          sanitizedData.status = (normalized === 'activo' || normalized === 'active') ? "Activo" : "Inactivo";
        }
      }

      const response = await trigger(sanitizedData);
      return response;
    } catch (error) {
      console.error("Error al actualizar el paciente:", error);
      throw error;
    }
  }

  return { updatePatient, loading, error };
}
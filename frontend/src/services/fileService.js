import apiClient from "./apiClient";

export const fileService = {
  // Subir archivo
  uploadFile: async (sessionId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`/sesion/${sessionId}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Obtener lista
  getFilesBySession: async (sessionId) => {
    const response = await apiClient.get(`/sesion/${sessionId}/files`);
    return response.data;
  },

  // Eliminar archivo
  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/sesion/files/${fileId}`);
    return response.data;
  }
};
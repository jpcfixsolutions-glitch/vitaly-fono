import { useState } from "react";
import { closeModal } from "../../../utils";
import { useDeleteConfigurationTimetable } from "./useDeleteConfigurationTimetable";

export const useSubmitDeleteConfigurationTimetable = (dataDeleteConfigurationTimetable) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    deleteConfigurationTimetable,
    loading: apiLoadingDeleteConfigurationTimetable,
    error: apiErrorDeleteConfigurationTimetable
  } = useDeleteConfigurationTimetable(dataDeleteConfigurationTimetable);

  const onDeleteConfigurationTimetable = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await deleteConfigurationTimetable();
      if (response?.status === "success") {
        setSuccessMessage("¡Configuración eliminada correctamente!");
        setTimeout(() => {
          closeModal("deleteConfigurationTimetableModal");
          window.location.reload();
        }, 2250);
      } else {
        setErrorMessage(response?.message);
      }
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setErrorMessage(null);
      setIsLoading(false);
    }
  };

  return {
    successMessage,
    errorMessage,
    isLoading,
    apiLoadingDeleteConfigurationTimetable,
    apiErrorDeleteConfigurationTimetable,
    onDeleteConfigurationTimetable
  };
};

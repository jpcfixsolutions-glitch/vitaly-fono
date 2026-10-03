import { useState } from "react";
import { closeModal } from "../../../utils";
import { useUpdateConfigurationTimetable } from "./useUpdateConfigurationTimetable";

export const useSubmitUpdateConfigurationTimetable = (dataUpdateConfigurationTimetable) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    updateConfigurationTimetable,
    loading: apiLoadingUpdateConfigurationTimetable,
    error: apiErrorUpdateConfigurationTimetable
  } = useUpdateConfigurationTimetable(dataUpdateConfigurationTimetable);

  const onUpdateConfigurationTimetable = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await updateConfigurationTimetable(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Configuración actualizada correctamente!");
        setTimeout(() => {
          closeModal("updateConfigurationTimetableModal");
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
    apiLoadingUpdateConfigurationTimetable,
    apiErrorUpdateConfigurationTimetable,
    onUpdateConfigurationTimetable
  };
};

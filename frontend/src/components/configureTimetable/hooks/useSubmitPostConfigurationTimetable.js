import { useState } from "react";
import { closeModal } from "../../../utils";
import { usePostConfigurationTimetable } from "./usePostConfigurationTimetable";

export const useSubmitPostConfigurationTimetable = (dataConfigurationTimetable) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    postConfigurationTimetable,
    loading: apiLoadingPostConfigurationTimetable,
    error: apiErrorPostConfigurationTimetable
  } = usePostConfigurationTimetable(dataConfigurationTimetable);

  const onSubmitConfigurationTimetable = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await postConfigurationTimetable(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Configuración creada correctamente!");
        setTimeout(() => {
          closeModal("createConfigurationTimetableModal");
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
    apiLoadingPostConfigurationTimetable,
    apiErrorPostConfigurationTimetable,
    onSubmitConfigurationTimetable
  };
};

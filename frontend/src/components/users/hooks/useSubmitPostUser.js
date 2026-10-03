import { useState } from "react";
import { closeModal } from "../../../utils";
import { usePostUser } from "./usePostUser";

export const useSubmitPostUser = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    postUser,
    loading: apiLoadingPostUser,
    error: apiErrorPostUser,
  } = usePostUser();

  const onSubmitUser = async (data) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await postUser(data);
      if (response?.status === "success") {
        setSuccessMessage("¡Usuario creado correctamente!");
        setTimeout(() => {
          closeModal("createUserModal");
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
    apiLoadingPostUser,
    apiErrorPostUser,
    onSubmitUser,
  };
};

import { useApi } from "../../../hooks";

export const useUpdatePassword = (dataChangePassword) => {
  const { trigger, loading, error } = useApi({
    id: dataChangePassword?.id,
    url: "/usuarios",
    method: "PATCH",
  });

  const updatePassword = async (formData) => {
    const sanitized = {
      password: formData?.password,
      confirmPassword: formData?.confirmPassword,
    };
    const response = await trigger(sanitized);
    return response;
  };

  return { updatePassword, loading, error };
};

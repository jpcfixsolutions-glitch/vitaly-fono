import { useApi } from "../../../hooks";

export const usePostUser = () => {
  const { trigger, loading, error } = useApi({
    url: "/usuarios/register",
    method: "POST",
  });

  const postUser = async (formData) => {
    const sanitized = {
      name: formData?.name?.trim(),
      last_name: formData?.last_name?.trim(),
      email: formData?.email?.trim(),
      password: formData?.password,
      id_rol: formData?.id_rol,
      status: formData?.status,
    };
    const response = await trigger(sanitized);
    return response;
  };

  return { postUser, loading, error };
};

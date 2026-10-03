import { useApi } from "../../../hooks";

export const useUpdateUser = (dataUpdateUser) => {
  const { trigger, loading, error } = useApi({
    id: dataUpdateUser?.id,
    url: "/usuarios",
    method: "PATCH",
  });

  const updateUser = async (formData) => {
    const sanitized = {
      id: formData?.id,
      name: formData?.name?.trim(),
      last_name: formData?.last_name?.trim(),
      email: formData?.email?.trim(),
      id_rol: formData?.id_rol,
      status: formData?.status,
    };

    const response = await trigger(sanitized, formData?.id);
    return response;
  };

  return { updateUser, loading, error };
};

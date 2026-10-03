import { useApi } from "../../../hooks";

export const useUpdateRole = (dataUpdateRole) => {
  const { trigger, loading, error } = useApi({
    id: dataUpdateRole?.id,
    url: "/rol",
    method: "PATCH",
  });

  const updateRole = async (formData) => {
    const sanitized = {
      id: formData?.id,
      name: formData?.name?.trim(),
      description: formData?.description?.trim(),
      privileges: formData?.privileges,
      status: formData?.status,
    };

    const response = await trigger(sanitized, formData?.id);
    return response;
  };

  return { updateRole, loading, error };
};

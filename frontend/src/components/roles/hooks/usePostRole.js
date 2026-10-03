import { useApi } from "../../../hooks";

export const usePostRole = () => {
  const { trigger, loading, error } = useApi({
    url: "/rol",
    method: "POST",
  });

  const postRole = async (formData) => {
    const sanitized = {
      name: formData?.name?.trim(),
      description: formData?.description?.trim(),
      privileges: formData?.privileges,
    };
    const response = await trigger(sanitized);
    return response;
  };

  return { postRole, loading, error };
};

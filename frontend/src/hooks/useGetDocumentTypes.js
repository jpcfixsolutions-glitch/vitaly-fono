import { useEffect, useState } from "react";
import { useApi } from ".";

export const useGetDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useApi({
    url: "/tipos-documento",
    method: "GET",
    autoFetch: true,
  });

  useEffect(() => {
    if (data) {
      setDocumentTypes({
        ...data,
        data: Array.isArray(data.data)
          ? data.data.filter((documentType) => documentType.status === "Activo")
          : []
      });
      setIsLoading(false);
    }
  }, [data]);

  return { documentTypes, loading: isLoading, error };
}

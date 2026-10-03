import { useEffect, useState } from "react";
import { useApi } from "../../../hooks";
import { orderByName } from "../../../utils";

export const useGetAllFirstInterviews = (id_user) => {
  const [dataInterviews, setDataInterviews] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error, loading, trigger } = useApi({
    url: `/primeras-entrevistas/usuario/${id_user}`,
    method: "GET",
    autoFetch: true,
  });

  const refetch = async () => {
    setIsLoading(true);
    setFinalError(null);
    await trigger();
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (data && data.status === 'success') {
      const items = Array.isArray(data?.data) ? data.data : [];
      let processedData = items;

      processedData = orderByName(processedData);

      setDataInterviews({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (error && !loading && !data.message.includes('undefined')) {
      setDataInterviews([]);
      setFinalError(error);
      setIsLoading(false);
      return;
    }

  }, [data, error, loading]);

  return { dataInterviews, loading: isLoading, error: finalError, refetch };
}

import { useEffect, useState } from "react";
import { useApi } from "../../../hooks";
import { filterByUser, orderByName } from "../../../utils";

export const useGetTreatmentClosure = () => {
  const [dataTreatmentClosure, setDataTreatmentClosure] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error, loading, trigger } = useApi({
    url: "/cierre-tratamientos",
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

      processedData = filterByUser(processedData);

      processedData = orderByName(processedData);

      setDataTreatmentClosure({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (error && !loading && !data.message.includes('undefined')) {
      setDataTreatmentClosure([]);
      setFinalError(error);
      setIsLoading(false);
      return;
    }

  }, [data, error, loading]);

  return { dataTreatmentClosure, loading: isLoading, error: finalError, refetch };
}

import { useEffect, useState } from "react";
import { useApi } from ".";
import { filterByUser, orderByName, parsePatient } from "../utils";

export const useGetAllPatients = () => {
  const [dataPatient, setDataPatient] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error, loading, trigger } = useApi({
    url: "/pacientes",
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

      processedData = parsePatient(processedData);

      processedData = orderByName(processedData);

      setDataPatient({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (error && !loading && !data.message.includes('undefined')) {
      setDataPatient([]);
      setFinalError(error);
      setIsLoading(false);
      return;
    }

  }, [data, error, loading]);

  return { dataPatient, loading: isLoading, error: finalError, refetch };
}

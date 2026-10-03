import { useEffect, useState } from "react";
import { useApi } from "../../../hooks";
import { filterByStatus, filterByUser, orderByName } from "../../../utils";

export const usePatientGet = ({ url, method, autoFetch = false }) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error: apiError, loading: apiLoading, trigger } = useApi({
    url,
    method,
    autoFetch
  });

  const refetch = async () => {
    setIsLoading(true);
    setFinalError(null);
    await trigger();
  };

  useEffect(() => {
    if (apiLoading) {
      return;
    }

    if (data && data.status === 'success') {
      const items = Array.isArray(data.data) ? data.data : [];
      let processedData = items;
      
      processedData = filterByUser(processedData);

      processedData = filterByStatus(processedData);

      processedData = orderByName(processedData);

      setPatients({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (apiError && !apiLoading && !data.message.includes('undefined')) {
      setPatients([]);
      setFinalError(apiError);
      setIsLoading(false);
      return;
    }

    if (!autoFetch) {
      setIsLoading(false);
    }

  }, [data, apiError, apiLoading, autoFetch]);

  return { patients, loading: isLoading, error: finalError, refetch };
};
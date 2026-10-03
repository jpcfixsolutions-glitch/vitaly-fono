import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import { filterByPagadaStatus, filterByRole, filterByStatus, filterByUser, orderByName, parsePatient } from "../utils";
import { orderByDayAndStartTime } from "../components/configureTimetable/utils";

export const useGet = ({ 
  url, 
  method, 
  autoFetch = false, 
  needFilterByStatus = true, 
  needOrderBy = false, 
  needFilterByUser = true, 
  needParse = false, 
  needFilterByRole = false, 
  needFilterByPagada = false }
) => {
  const [dataGet, setDataGet] = useState({ data: [] });
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

      if (needFilterByUser) {
        processedData = filterByUser(processedData);
      }

      if (needOrderBy) {
        processedData = orderByDayAndStartTime(processedData);
      }

      if (needFilterByStatus) {
        processedData = filterByStatus(processedData);
      }

      if (needFilterByPagada) {
        processedData = filterByPagadaStatus(processedData);
      }

      if (needParse) {
        processedData = parsePatient(processedData);
      }

      if (needFilterByRole) {
        processedData = filterByRole(processedData);
      }

      processedData = orderByName(processedData);

      setDataGet({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (apiError && !apiLoading && !data.message.includes('undefined')) {
      setDataGet({ data: [] });
      setFinalError(apiError);
      setIsLoading(false);
      return;
    }

    if (!autoFetch) {
      setIsLoading(false);
    }

  }, [data, apiError, apiLoading, needFilterByStatus, needOrderBy, autoFetch, needFilterByUser]);

  return { dataGet, loading: isLoading, error: finalError, refetch };
};
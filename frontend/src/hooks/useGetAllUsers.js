import { useEffect, useState } from "react";
import { useApi } from ".";
import { filterByUser, orderByName } from "../utils";

export const useGetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [finalError, setFinalError] = useState(null);

  const { data, error, loading, trigger } = useApi({
    url: "/usuarios",
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

      setUsers({ data: processedData });
      setFinalError(null);
      setIsLoading(false);
      return;
    }

    if (error && !loading && !data.message.includes('undefined')) {
      setUsers([]);
      setFinalError(error);
      setIsLoading(false);
      return;
    }

  }, [data, error, loading]);

  return { users, loading: isLoading, error: finalError, refetch };
};

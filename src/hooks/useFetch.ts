import {useState, useEffect} from 'react';
import {makeApiRequest} from '../utils/helpers';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(
  url: string,
  method: string = 'GET',
  payload?: Record<string, any>,
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const {data, error} = await makeApiRequest<T>(url, method, payload);

      if (error) {
        setError(error.msg);
        setLoading(false);
      }

      if (data) {
        setData(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return {data, loading, error};
}

export default useFetch;

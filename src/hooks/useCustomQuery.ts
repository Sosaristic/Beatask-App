import {useQuery} from '@tanstack/react-query';
import {makeApiRequest} from '../utils/helpers';

const useCustomQuery = <T>(
  key: string[],
  url: string,
  method: string,
  payload?: Record<string, any>,
  options?: Record<string, any>,
) => {
  const fetchData = async () => {
    const {data, error} = await makeApiRequest<T>(url, method, payload);
    if (data) return data;
    if (error) {
      throw new Error(error.msg);
    }
  };

  return useQuery({
    queryKey: key,
    queryFn: () => fetchData(),
    staleTime: 0,
    gcTime: 0,
  });
};

export default useCustomQuery;

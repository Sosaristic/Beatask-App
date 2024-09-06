import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

type ApiError = {
  error: boolean;
  msg: string;
};

const apiInstance = axios.create({
  baseURL: 'https://beatask.cloud',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 60000,
  timeoutErrorMessage: 'Request timed out',
});

export const makeApiRequest = async <T>(
  url: string,
  method: string,

  data?: Record<string, unknown> | FormData,
  config?: AxiosRequestConfig,
): Promise<{data?: T; error?: ApiError}> => {
  try {
    const response: AxiosResponse<T> = await apiInstance.request<T>({
      url,
      method,
      data,
      ...config,
    });
    console.log('res', response);

    if (Object.hasOwn(response.data as object, 'error')) {
      return {error: response.data as ApiError};
    }

    return {data: response.data as T};
  } catch (error) {
    console.log('err', error);
    let apiError: ApiError | undefined;

    if (error instanceof Error) {
      apiError = {
        msg: error.message,

        error: false,
      };
    }

    return {error: apiError};
  }
};

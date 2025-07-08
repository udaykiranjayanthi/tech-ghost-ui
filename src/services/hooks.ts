import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axiosInstance from "./axios";

type ApiQueryParams<T, TParams = unknown> = {
  queryKey: (string | number)[];
  url: string;
  params?: TParams;
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;
};

export function useApiQuery<T, TParams = unknown>({
  queryKey,
  url,
  params,
  options,
}: ApiQueryParams<T, TParams>) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get<T>(url, { params });
      return response.data;
    },
    ...options,
  });
}

type MutationMethod = "post" | "put" | "patch" | "delete" | "get";

type Variables<TPayload = any> = {
  payload?: TPayload;
  params?: any;
};

interface ApiMutationParams<TData, TPayload> {
  url: string;
  method?: MutationMethod;
  options?: UseMutationOptions<TData, Error, Variables<TPayload>>;
}

export function useApiMutation<TData, TPayload>({
  url,
  method = "post",
  options,
}: ApiMutationParams<TData, TPayload>) {
  return useMutation<TData, Error, Variables<TPayload>>({
    mutationFn: async (variables?: Variables<TPayload>) => {
      const response = await axiosInstance.request<TData>({
        url,
        method,
        params: variables?.params,
        data: variables?.payload,
      });
      return response.data;
    },
    ...options,
  });
}

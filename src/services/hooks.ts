import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axiosInstance from "./axios";

type ApiQueryParams<T> = {
  queryKey: (string | number)[];
  url: string;
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">;
};

export function useApiQuery<T>({ queryKey, url, options }: ApiQueryParams<T>) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get<T>(url);
      return response.data;
    },
    ...options,
  });
}

type MutationMethod = "post" | "put" | "patch" | "delete";

interface ApiMutationParams<TData, TVariables> {
  url: string;
  method?: MutationMethod;
  options?: UseMutationOptions<TData, Error, TVariables>;
}

export function useApiMutation<TData, TVariables = unknown>({
  url,
  method = "post",
  options,
}: ApiMutationParams<TData, TVariables>) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await axiosInstance.request<TData>({
        url,
        method,
        data: variables,
      });
      return response.data;
    },
    ...options,
  });
}

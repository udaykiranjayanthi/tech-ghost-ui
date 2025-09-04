import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type DefinedInitialDataInfiniteOptions,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import axiosInstance from "./axios";
import type { ErrorResponse, InfinitePagination } from "@/types";
import type { AxiosError } from "axios";

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
  return useMutation<TData, AxiosError<ErrorResponse>, Variables<TPayload>>({
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

type ApiInfiniteQueryParams<TData> = {
  queryKey: (string | number)[];
  url: string;
  params?: any;
  initialPageParam?: any;
  options?: Omit<
    DefinedInitialDataInfiniteOptions<TData, Error>,
    | "queryKey"
    | "queryFn"
    | "initialPageParam"
    | "getNextPageParam"
    | "initialData"
  >;
};

export function useApiInfiniteQuery<TData>({
  queryKey,
  url,
  params,
  initialPageParam,
  options,
}: ApiInfiniteQueryParams<InfinitePagination<TData>>) {
  return useInfiniteQuery<InfinitePagination<TData>>({
    queryKey,
    queryFn: async ({ pageParam = null }: any) => {
      const queryParams = {
        ...params,
        cursorCreatedAt: pageParam?.createdAt,
        cursorId: pageParam?.id,
      };
      const response = await axiosInstance.get<InfinitePagination<TData>>(url, {
        params: queryParams,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursorCreatedAt || !lastPage.nextCursorId) return null;

      return {
        createdAt: lastPage.nextCursorCreatedAt,
        id: lastPage.nextCursorId,
      };
    },
    initialPageParam,
    ...options,
  });
}

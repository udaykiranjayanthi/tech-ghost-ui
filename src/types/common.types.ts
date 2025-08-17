export type Pagination<T> = {
  data: T[];
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  nextCursorCreatedAt: string;
  nextCursorId: string;
};

export type InfinitePagination<T> = {
  data: T[];
  nextCursorCreatedAt: string;
  nextCursorId: string;
};

export interface ErrorResponse {
  errorCode: string;
  message: string;
  timestamp: Date;
  fieldErrors: Record<string, string>;
}

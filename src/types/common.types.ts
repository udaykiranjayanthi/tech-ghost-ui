export type Pagination<T> = {
  data: T[];
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

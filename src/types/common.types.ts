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

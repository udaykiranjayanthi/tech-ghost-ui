export type Pagination<T> = {
  data: T[];
  pageSize: number;
  currentPage: number;
  totalRecords: number;
};

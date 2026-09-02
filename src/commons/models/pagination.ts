export type PaginationParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type PaginationResult<T> = {
  status: number;
  message?: string;
  data: PaginatedResponse<T> | null;
  error?: string | null;
};

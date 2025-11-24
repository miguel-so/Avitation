export interface ApiResponse<T> {
  data: T;
  meta?: unknown;
}

export interface PaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}


import { Request } from 'express';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const getPaginationParams = (req: Request): PaginationParams => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 25;

  return {
    page: Math.max(1, page),
    pageSize: Math.min(Math.max(1, pageSize), 100),
  };
};

export const buildMeta = <T>(result: PaginatedResult<T>) => ({
  pagination: {
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    totalPages: result.totalPages,
  },
});


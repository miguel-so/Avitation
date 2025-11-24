import { Response } from 'express';

type Meta = Record<string, unknown>;

export interface ApiResponse<T> {
  data: T;
  meta?: Meta;
}

export const send = <T>(res: Response, statusCode: number, data: T, meta?: Meta) => {
  const payload: ApiResponse<T> = { data };
  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const ok = <T>(res: Response, data: T, meta?: Meta) => send(res, 200, data, meta);
export const created = <T>(res: Response, data: T, meta?: Meta) => send(res, 201, data, meta);
export const noContent = (res: Response) => res.status(204).send();


import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { ok } from '../../core/http';
import { loginSchema, refreshSchema } from './auth.schemas';
import { login, refreshSession } from './auth.service';

export const loginHandler = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError('Invalid login payload', parsed.error.flatten());
  }

  const result = await login(parsed.data);
  return ok(res, result);
};

export const refreshHandler = async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError('Invalid refresh payload', parsed.error.flatten());
  }

  const result = await refreshSession(parsed.data);
  return ok(res, result);
};


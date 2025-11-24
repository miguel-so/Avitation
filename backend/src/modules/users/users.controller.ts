import type { Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import type { AuthenticatedRequest } from '../../types/express';
import { createUserSchema, updateUserSchema, userIdParamsSchema } from './users.schemas';
import { createUser, listUsers, updateUser } from './users.service';

export const listUsersHandler = async (_req: AuthenticatedRequest, res: Response) => {
  const users = await listUsers();
  return ok(res, users);
};

export const createUserHandler = async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError('Invalid user payload', parsed.error.flatten());
  }

  const user = await createUser(parsed.data);
  return created(res, user);
};

export const updateUserHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = userIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid user id', params.error.flatten());
  }

  const body = updateUserSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid user payload', body.error.flatten());
  }

  const user = await updateUser(params.data.userId, body.data);
  return ok(res, user);
};


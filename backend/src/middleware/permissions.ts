import type { NextFunction, Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '../core/error';
import type { AuthenticatedRequest } from '../types/express';

type Role = 'VictorAdmin' | 'OperatorAdmin' | 'Handler' | 'AuthorityUser';

export const requireRoles = (...allowed: Role[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!allowed.includes(req.user.role as Role)) {
      throw new ForbiddenError();
    }

    next();
  };
};


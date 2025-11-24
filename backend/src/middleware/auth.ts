import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../core/error';
import { verifyAccessToken } from '../lib/tokens';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing bearer token');
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};


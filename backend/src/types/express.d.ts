import type { Request } from 'express';

declare global {
  namespace Express {
    interface UserContext {
      id: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export type AuthenticatedRequest = Request & { user: Express.UserContext };


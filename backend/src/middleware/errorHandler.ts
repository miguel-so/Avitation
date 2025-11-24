import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../core/error';
import { logger } from '../config/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn({ err }, 'Handled application error');
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  logger.error({ err }, 'Unexpected error');

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
};


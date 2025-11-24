import { PrismaClient } from '@prisma/client';

import { env, isProduction } from '../config/env';
import { logger } from '../config/logger';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error'] : ['query', 'error', 'warn'],
  });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}

prisma
  .$connect()
  .then(() => logger.info('Connected to database'))
  .catch((error) => {
    logger.error({ error }, 'Failed to connect to database');
    process.exit(1);
  });


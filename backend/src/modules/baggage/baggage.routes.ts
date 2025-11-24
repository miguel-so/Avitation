import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  createBaggageHandler,
  listBaggageHandler,
  scanBaggageHandler,
} from './baggage.controller';

const flightsRouter = Router({ mergeParams: true });
const scanRouter = Router();

flightsRouter.use(authenticate);
scanRouter.use(authenticate);

flightsRouter.get(
  '/:flightId/baggage',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'Handler', 'AuthorityUser'),
  listBaggageHandler,
);

flightsRouter.post(
  '/:flightId/baggage',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  createBaggageHandler,
);

scanRouter.post(
  '/:baggageId/scan',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'Handler'),
  scanBaggageHandler,
);

export const baggageRouter = flightsRouter;
export const baggageScanRouter = scanRouter;


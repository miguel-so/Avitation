import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  createFlightHandler,
  getFlightHandler,
  listFlightsHandler,
  updateFlightHandler,
} from './flights.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  listFlightsHandler,
);

router.get(
  '/:flightId',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'Handler', 'AuthorityUser'),
  getFlightHandler,
);

router.post(
  '/',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  createFlightHandler,
);

router.put(
  '/:flightId',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  updateFlightHandler,
);

export const flightsRouter = router;


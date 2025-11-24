import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  createPassengerHandler,
  listPassengersHandler,
  updatePassengerHandler,
} from './passengers.controller';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get(
  '/:flightId/passengers',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'Handler', 'AuthorityUser'),
  listPassengersHandler,
);

router.post(
  '/:flightId/passengers',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  createPassengerHandler,
);

router.put(
  '/:flightId/passengers/:passengerId',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  updatePassengerHandler,
);

export const passengersRouter = router;


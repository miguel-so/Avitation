import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  createCrewHandler,
  listCrewHandler,
  updateCrewHandler,
} from './crew.controller';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get(
  '/:flightId/crew',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'AuthorityUser'),
  listCrewHandler,
);

router.post(
  '/:flightId/crew',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  createCrewHandler,
);

router.put(
  '/:flightId/crew/:crewId',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  updateCrewHandler,
);

export const crewRouter = router;


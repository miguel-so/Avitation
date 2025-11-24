import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  createAirportHandler,
  listAirportsHandler,
  updateAirportHandler,
} from './airports.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'Handler', 'AuthorityUser'),
  listAirportsHandler,
);

router.post('/', requireRoles('VictorAdmin'), createAirportHandler);

router.put('/:airportId', requireRoles('VictorAdmin'), updateAirportHandler);

export const airportsRouter = router;


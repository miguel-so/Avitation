import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  generateCrewQrPassHandler,
  generatePassengerQrPassHandler,
  getQrPassPublicHandler,
} from './qrpass.controller';

const flightRouter = Router({ mergeParams: true });
const publicRouter = Router();

flightRouter.use(authenticate);
publicRouter.use(authenticate);

flightRouter.post(
  '/:flightId/passengers/:passengerId/qr-pass',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  generatePassengerQrPassHandler,
);

flightRouter.post(
  '/:flightId/crew/:crewId/qr-pass',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  generateCrewQrPassHandler,
);

publicRouter.get(
  '/:token',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'Handler', 'AuthorityUser'),
  getQrPassPublicHandler,
);

export const qrPassFlightRouter = flightRouter;
export const qrPassRouter = publicRouter;


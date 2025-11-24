import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  getGeneralDeclarationHandler,
  listAuthorityFlightsHandler,
} from './authority.controller';

const router = Router();

router.use(authenticate);

router.get(
  '/flights',
  requireRoles('AuthorityUser', 'VictorAdmin'),
  listAuthorityFlightsHandler,
);

router.get(
  '/flights/:flightId/general-declaration',
  requireRoles('AuthorityUser', 'VictorAdmin'),
  getGeneralDeclarationHandler,
);

export const authorityRouter = router;


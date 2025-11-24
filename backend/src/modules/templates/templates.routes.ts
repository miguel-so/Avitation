import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  createTemplateHandler,
  listTemplatesHandler,
  updateTemplateHandler,
} from './templates.controller';

const router = Router();

router.use(authenticate);

router.get('/', requireRoles('VictorAdmin'), listTemplatesHandler);
router.post('/', requireRoles('VictorAdmin'), createTemplateHandler);
router.put('/:templateId', requireRoles('VictorAdmin'), updateTemplateHandler);

export const templatesRouter = router;


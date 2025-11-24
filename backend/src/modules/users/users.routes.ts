import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import { createUserHandler, listUsersHandler, updateUserHandler } from './users.controller';

const router = Router();

router.use(authenticate);
router.use(requireRoles('VictorAdmin'));

router.get('/', listUsersHandler);
router.post('/', createUserHandler);
router.put('/:userId', updateUserHandler);

export const usersRouter = router;


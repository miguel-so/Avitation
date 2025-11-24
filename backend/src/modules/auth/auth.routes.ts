import { Router } from 'express';

import { loginHandler, refreshHandler } from './auth.controller';

const router = Router();

router.post('/login', loginHandler);
router.post('/refresh', refreshHandler);

export const authRouter = router;


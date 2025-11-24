import { Router } from 'express';

import { authorityRouter } from '../modules/authority/authority.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { baggageRouter, baggageScanRouter } from '../modules/baggage/baggage.routes';
import { crewRouter } from '../modules/crew/crew.routes';
import { documentDetailRouter, documentsRouter } from '../modules/documents/documents.routes';
import { flightsRouter } from '../modules/flights/flights.routes';
import { passengersRouter } from '../modules/passengers/passengers.routes';
import { qrPassFlightRouter, qrPassRouter } from '../modules/qrpass/qrpass.routes';
import { airportsRouter } from '../modules/airports/airports.routes';
import { templatesRouter } from '../modules/templates/templates.routes';
import { usersRouter } from '../modules/users/users.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/flights', flightsRouter);
router.use('/flights', passengersRouter);
router.use('/flights', crewRouter);
router.use('/flights', baggageRouter);
router.use('/flights', qrPassFlightRouter);
router.use('/baggage', baggageScanRouter);
router.use('/flights', documentsRouter);
router.use('/documents', documentDetailRouter);
router.use('/qr-pass', qrPassRouter);
router.use('/authority', authorityRouter);
router.use('/airports', airportsRouter);
router.use('/templates', templatesRouter);
router.use('/users', usersRouter);

export { router };


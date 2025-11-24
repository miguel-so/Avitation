import type { Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import type { AuthenticatedRequest } from '../../types/express';
import {
  crewQrParamsSchema,
  passengerQrParamsSchema,
  qrPassPayloadSchema,
  qrTokenParamsSchema,
} from './qrpass.schemas';
import {
  generateCrewQrPass,
  generatePassengerQrPass,
  getQrPassPublic,
} from './qrpass.service';

export const generatePassengerQrPassHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = passengerQrParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid identifiers', params.error.flatten());
  }

  const body = qrPassPayloadSchema.safeParse(req.body ?? {});

  if (!body.success) {
    throw new ValidationError('Invalid payload', body.error.flatten());
  }

  const qrPass = await generatePassengerQrPass(
    params.data.flightId,
    params.data.passengerId,
    body.data,
    req.user.id,
  );

  return created(res, qrPass);
};

export const generateCrewQrPassHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = crewQrParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid identifiers', params.error.flatten());
  }

  const body = qrPassPayloadSchema.safeParse(req.body ?? {});

  if (!body.success) {
    throw new ValidationError('Invalid payload', body.error.flatten());
  }

  const qrPass = await generateCrewQrPass(
    params.data.flightId,
    params.data.crewId,
    body.data,
    req.user.id,
  );

  return created(res, qrPass);
};

export const getQrPassPublicHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = qrTokenParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid token', params.error.flatten());
  }

  const qrPass = await getQrPassPublic(params.data.token);
  return ok(res, qrPass);
};


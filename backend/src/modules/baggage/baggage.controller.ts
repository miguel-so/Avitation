import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import {
  baggageIdParamsSchema,
  baggageRouteParamsSchema,
  createBaggageSchema,
  scanBaggageSchema,
} from './baggage.schemas';
import { createBaggage, listBaggage, scanBaggage } from './baggage.service';

export const listBaggageHandler = async (req: Request, res: Response) => {
  const params = baggageRouteParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const baggage = await listBaggage(params.data.flightId);
  return ok(res, baggage);
};

export const createBaggageHandler = async (req: Request, res: Response) => {
  const params = baggageRouteParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const body = createBaggageSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid baggage payload', body.error.flatten());
  }

  const baggage = await createBaggage(params.data.flightId, body.data);
  return created(res, baggage);
};

export const scanBaggageHandler = async (req: Request, res: Response) => {
  const params = baggageIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid baggage id', params.error.flatten());
  }

  const body = scanBaggageSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid scan payload', body.error.flatten());
  }

  const baggage = await scanBaggage(params.data.baggageId, body.data);
  return ok(res, baggage);
};


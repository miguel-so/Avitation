import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import {
  createPassengerSchema,
  passengerIdParamsSchema,
  passengerRouteParamsSchema,
  updatePassengerSchema,
} from './passengers.schemas';
import { createPassenger, listPassengers, updatePassenger } from './passengers.service';

export const listPassengersHandler = async (req: Request, res: Response) => {
  const params = passengerRouteParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const passengers = await listPassengers(params.data.flightId);
  return ok(res, passengers);
};

export const createPassengerHandler = async (req: Request, res: Response) => {
  const params = passengerRouteParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const body = createPassengerSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid passenger payload', body.error.flatten());
  }

  const passenger = await createPassenger(params.data.flightId, body.data);
  return created(res, passenger);
};

export const updatePassengerHandler = async (req: Request, res: Response) => {
  const params = passengerIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid identifiers', params.error.flatten());
  }

  const body = updatePassengerSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid passenger payload', body.error.flatten());
  }

  const passenger = await updatePassenger(
    params.data.flightId,
    params.data.passengerId,
    body.data,
  );

  return ok(res, passenger);
};


import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import { buildMeta, getPaginationParams } from '../../core/pagination';
import {
  createFlightSchema,
  flightFiltersSchema,
  flightParamSchema,
  updateFlightSchema,
} from './flights.schemas';
import { createFlight, getFlightById, listFlights, updateFlight } from './flights.service';

export const listFlightsHandler = async (req: Request, res: Response) => {
  const filtersResult = flightFiltersSchema.safeParse(req.query);

  if (!filtersResult.success) {
    throw new ValidationError('Invalid flight filters', filtersResult.error.flatten());
  }

  const pagination = getPaginationParams(req);
  const result = await listFlights(filtersResult.data, pagination);

  return ok(res, result.items, buildMeta(result));
};

export const getFlightHandler = async (req: Request, res: Response) => {
  const paramsResult = flightParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new ValidationError('Invalid flight id', paramsResult.error.flatten());
  }

  const flight = await getFlightById(paramsResult.data.flightId);
  return ok(res, flight);
};

export const createFlightHandler = async (req: Request, res: Response) => {
  const bodyResult = createFlightSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new ValidationError('Invalid flight payload', bodyResult.error.flatten());
  }

  const flight = await createFlight(bodyResult.data);
  return created(res, flight);
};

export const updateFlightHandler = async (req: Request, res: Response) => {
  const paramsResult = flightParamSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new ValidationError('Invalid flight id', paramsResult.error.flatten());
  }

  const bodyResult = updateFlightSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new ValidationError('Invalid flight payload', bodyResult.error.flatten());
  }

  const flight = await updateFlight(paramsResult.data.flightId, bodyResult.data);
  return ok(res, flight);
};


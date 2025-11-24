import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import {
  airportIdParamsSchema,
  createAirportSchema,
  listAirportsQuerySchema,
  updateAirportSchema,
} from './airports.schemas';
import { createAirport, listAirports, updateAirport } from './airports.service';

export const listAirportsHandler = async (req: Request, res: Response) => {
  const parsed = listAirportsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ValidationError('Invalid airport filters', parsed.error.flatten());
  }

  const airports = await listAirports(parsed.data);
  return ok(res, airports);
};

export const createAirportHandler = async (req: Request, res: Response) => {
  const parsed = createAirportSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError('Invalid airport payload', parsed.error.flatten());
  }

  const airport = await createAirport(parsed.data);
  return created(res, airport);
};

export const updateAirportHandler = async (req: Request, res: Response) => {
  const paramsResult = airportIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new ValidationError('Invalid airport identifier', paramsResult.error.flatten());
  }

  const bodyResult = updateAirportSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new ValidationError('Invalid airport payload', bodyResult.error.flatten());
  }

  const airport = await updateAirport(paramsResult.data.airportId, bodyResult.data);
  return ok(res, airport);
};


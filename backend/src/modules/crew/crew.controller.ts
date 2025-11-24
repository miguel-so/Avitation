import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import {
  createCrewSchema,
  crewIdParamsSchema,
  crewRouteParamsSchema,
  updateCrewSchema,
} from './crew.schemas';
import { createCrewMember, listCrew, updateCrewMember } from './crew.service';

export const listCrewHandler = async (req: Request, res: Response) => {
  const params = crewRouteParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const crew = await listCrew(params.data.flightId);
  return ok(res, crew);
};

export const createCrewHandler = async (req: Request, res: Response) => {
  const params = crewRouteParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const body = createCrewSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid crew payload', body.error.flatten());
  }

  const crew = await createCrewMember(params.data.flightId, body.data);
  return created(res, crew);
};

export const updateCrewHandler = async (req: Request, res: Response) => {
  const params = crewIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid identifiers', params.error.flatten());
  }

  const body = updateCrewSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid crew payload', body.error.flatten());
  }

  const crew = await updateCrewMember(params.data.flightId, params.data.crewId, body.data);
  return ok(res, crew);
};


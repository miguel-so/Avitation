import type { Response } from 'express';

import { ValidationError } from '../../core/error';
import { ok } from '../../core/http';
import type { AuthenticatedRequest } from '../../types/express';
import {
  authorityFlightFilterSchema,
  authorityFlightParamsSchema,
} from './authority.schemas';
import {
  getLatestGeneralDeclaration,
  listAuthorityFlights,
} from './authority.service';

export const listAuthorityFlightsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const filters = authorityFlightFilterSchema.safeParse(req.query);

  if (!filters.success) {
    throw new ValidationError('Invalid filters', filters.error.flatten());
  }

  const flights = await listAuthorityFlights(filters.data);
  return ok(res, flights);
};

export const getGeneralDeclarationHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = authorityFlightParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const document = await getLatestGeneralDeclaration(params.data.flightId);
  return ok(res, document);
};


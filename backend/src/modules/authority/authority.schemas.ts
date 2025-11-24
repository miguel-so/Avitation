import { z } from 'zod';

export const authorityFlightFilterSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  airport: z.string().optional(),
});

export const authorityFlightParamsSchema = z.object({
  flightId: z.string().uuid(),
});


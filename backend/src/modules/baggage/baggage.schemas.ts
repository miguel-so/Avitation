import { z } from 'zod';

export const baggageRouteParamsSchema = z.object({
  flightId: z.string().uuid(),
});

export const baggageIdParamsSchema = z.object({
  baggageId: z.string().uuid(),
});

export const createBaggageSchema = z.object({
  passengerId: z.string().uuid().optional(),
  tagCode: z.string().min(1),
  weightKg: z.number().positive().optional(),
  pieces: z.number().int().positive().default(1),
  status: z.string().default('created'),
  metadata: z.record(z.unknown()).optional(),
});

export const scanBaggageSchema = z.object({
  status: z.string().min(1),
  location: z.string().optional(),
  scannedAt: z.coerce.date().optional(),
});

export type CreateBaggageInput = z.infer<typeof createBaggageSchema>;
export type ScanBaggageInput = z.infer<typeof scanBaggageSchema>;


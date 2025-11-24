import { z } from 'zod';

export const passengerQrParamsSchema = z.object({
  flightId: z.string().uuid(),
  passengerId: z.string().uuid(),
});

export const crewQrParamsSchema = z.object({
  flightId: z.string().uuid(),
  crewId: z.string().uuid(),
});

export const qrPassPayloadSchema = z.object({
  accessLevel: z.string().default('passenger'),
  expiresAt: z.coerce.date().optional(),
});

export const qrTokenParamsSchema = z.object({
  token: z.string().min(1),
});

export type QrPassPayloadInput = z.infer<typeof qrPassPayloadSchema>;


import { z } from 'zod';

export const passengerBaseSchema = {
  fullName: z.string().min(1),
  gender: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportCountry: z.string().optional(),
  passportExpiry: z.coerce.date().optional(),
  visaNumber: z.string().optional(),
  status: z.string().optional(),
  seatNumber: z.string().optional(),
  baggageCount: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
};

export const passengerRouteParamsSchema = z.object({
  flightId: z.string().uuid(),
});

export const passengerIdParamsSchema = z.object({
  flightId: z.string().uuid(),
  passengerId: z.string().uuid(),
});

export const createPassengerSchema = z.object({
  ...passengerBaseSchema,
});

export const updatePassengerSchema = z
  .object({
    ...passengerBaseSchema,
  })
  .partial();

export type CreatePassengerInput = z.infer<typeof createPassengerSchema>;
export type UpdatePassengerInput = z.infer<typeof updatePassengerSchema>;


import { z } from 'zod';

const uppercase = (value: string) => value.toUpperCase();

export const listAirportsQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional(),
  country: z
    .string()
    .trim()
    .optional(),
});

export const createAirportSchema = z.object({
  id: z
    .string()
    .min(3)
    .max(10)
    .transform(uppercase),
  name: z.string().min(1),
  icaoCode: z
    .string()
    .length(4)
    .transform(uppercase),
  iataCode: z
    .string()
    .length(3)
    .transform(uppercase)
    .optional(),
  city: z.string().min(1),
  country: z.string().min(1),
  timezone: z.string().min(1),
});

export const updateAirportSchema = createAirportSchema
  .omit({ id: true, icaoCode: true })
  .extend({
    icaoCode: z
      .string()
      .length(4)
      .transform(uppercase)
      .optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const airportIdParamsSchema = z.object({
  airportId: z.string().min(1),
});

export type ListAirportsQueryInput = z.infer<typeof listAirportsQuerySchema>;
export type CreateAirportInput = z.infer<typeof createAirportSchema>;
export type UpdateAirportInput = z.infer<typeof updateAirportSchema>;


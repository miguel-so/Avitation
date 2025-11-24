import { z } from 'zod';

const crewBaseSchema = {
  fullName: z.string().min(1),
  rank: z.string().optional(),
  nationality: z.string().optional(),
  licenceNumber: z.string().optional(),
  licenceExpiry: z.coerce.date().optional(),
  dutyType: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
};

export const crewRouteParamsSchema = z.object({
  flightId: z.string().uuid(),
});

export const crewIdParamsSchema = z.object({
  flightId: z.string().uuid(),
  crewId: z.string().uuid(),
});

export const createCrewSchema = z.object({
  ...crewBaseSchema,
});

export const updateCrewSchema = z
  .object({
    ...crewBaseSchema,
  })
  .partial();

export type CreateCrewInput = z.infer<typeof createCrewSchema>;
export type UpdateCrewInput = z.infer<typeof updateCrewSchema>;


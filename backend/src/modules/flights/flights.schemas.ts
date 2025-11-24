import { z } from 'zod';

export const flightFiltersSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  airport: z.string().optional(),
  operator: z.string().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

const baseFlightFields = {
  uid: z.string().min(1),
  operatorName: z.string().min(1),
  aircraftType: z.string().min(1),
  aircraftRegistration: z.string().min(1),
  mtow: z.number().int().positive().optional(),
  purpose: z.string().optional(),
  departureAirportId: z.string().min(3),
  arrivalAirportId: z.string().min(3),
  scheduledDeparture: z.coerce.date(),
  scheduledArrival: z.coerce.date(),
  actualDeparture: z.coerce.date().optional(),
  actualArrival: z.coerce.date().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  turnaroundStatus: z.string().optional(),
  captainName: z.string().optional(),
  firstOfficerName: z.string().optional(),
};

export const createFlightSchema = z.object({
  ...baseFlightFields,
});

export const updateFlightSchema = z.object({
  ...baseFlightFields,
}).partial();

export const flightParamSchema = z.object({
  flightId: z.string().uuid(),
});

export type FlightFiltersInput = z.infer<typeof flightFiltersSchema>;
export type CreateFlightInput = z.infer<typeof createFlightSchema>;
export type UpdateFlightInput = z.infer<typeof updateFlightSchema>;


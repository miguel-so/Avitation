import type { Prisma } from '@prisma/client';

import { ConflictError, NotFoundError } from '../../core/error';
import type { PaginationParams, PaginatedResult } from '../../core/pagination';
import { prisma } from '../../lib/prisma';
import type {
  CreateFlightInput,
  FlightFiltersInput,
  UpdateFlightInput,
} from './flights.schemas';

const buildWhere = (filters: FlightFiltersInput): Prisma.FlightWhereInput => {
  const where: Prisma.FlightWhereInput = {};

  if (filters.operator) {
    where.operatorName = { contains: filters.operator, mode: 'insensitive' };
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.airport) {
    where.OR = [
      { departureAirportId: filters.airport },
      { arrivalAirportId: filters.airport },
    ];
  }

  if (filters.dateFrom || filters.dateTo) {
    where.scheduledDeparture = {};
    if (filters.dateFrom) {
      where.scheduledDeparture.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.scheduledDeparture.lte = new Date(filters.dateTo);
    }
  }

  return where;
};

export const listFlights = async (
  filters: FlightFiltersInput,
  { page, pageSize }: PaginationParams,
): Promise<PaginatedResult<unknown>> => {
  const where = buildWhere(filters);
  const [total, items] = await prisma.$transaction([
    prisma.flight.count({ where }),
    prisma.flight.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { scheduledDeparture: 'desc' },
      include: {
        departureAirport: true,
        arrivalAirport: true,
      },
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
};

export const getFlightById = async (flightId: string) => {
  const flight = await prisma.flight.findUnique({
    where: { id: flightId },
    include: {
      departureAirport: true,
      arrivalAirport: true,
      passengers: true,
      crew: true,
      documents: true,
      baggageItems: true,
    },
  });

  if (!flight) {
    throw new NotFoundError('Flight not found');
  }

  return flight;
};

export const createFlight = async (data: CreateFlightInput) => {
  const existing = await prisma.flight.findUnique({
    where: { uid: data.uid },
  });

  if (existing) {
    throw new ConflictError('Flight with this UID already exists', { uid: data.uid });
  }

  return prisma.flight.create({
    data: {
      ...data,
      passengerCount: 0,
      crewCount: 0,
    },
  });
};

export const updateFlight = async (flightId: string, data: UpdateFlightInput) => {
  const existing = await prisma.flight.findUnique({ where: { id: flightId } });

  if (!existing) {
    throw new NotFoundError('Flight not found');
  }

  return prisma.flight.update({
    where: { id: flightId },
    data: {
      ...data,
      version: { increment: 1 },
    },
  });
};


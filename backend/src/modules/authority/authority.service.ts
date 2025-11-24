import type { Prisma } from '@prisma/client';

import { NotFoundError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import type { FlightFiltersInput } from '../flights/flights.schemas';

const buildAuthorityWhere = (filters: FlightFiltersInput): Prisma.FlightWhereInput => {
  const where: Prisma.FlightWhereInput = {};

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

export const listAuthorityFlights = async (filters: FlightFiltersInput) => {
  const where = buildAuthorityWhere(filters);

  return prisma.flight.findMany({
    where,
    orderBy: { scheduledDeparture: 'desc' },
    select: {
      id: true,
      uid: true,
      operatorName: true,
      aircraftType: true,
      departureAirportId: true,
      arrivalAirportId: true,
      scheduledDeparture: true,
      scheduledArrival: true,
      status: true,
    },
    take: 200,
  });
};

export const getLatestGeneralDeclaration = async (flightId: string) => {
  const document = await prisma.document.findFirst({
    where: { flightId, type: 'GENERAL_DECLARATION' },
    orderBy: { generatedAt: 'desc' },
  });

  if (!document) {
    throw new NotFoundError('General Declaration not found');
  }

  return document;
};


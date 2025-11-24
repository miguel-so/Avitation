import type { Prisma } from '@prisma/client';

import { NotFoundError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import type {
  CreateAirportInput,
  ListAirportsQueryInput,
  UpdateAirportInput,
} from './airports.schemas';

const buildWhere = (filters: ListAirportsQueryInput): Prisma.AirportWhereInput => {
  const where: Prisma.AirportWhereInput = {};

  if (filters.search) {
    const query = filters.search.trim();
    where.OR = [
      { id: { contains: query, mode: 'insensitive' } },
      { name: { contains: query, mode: 'insensitive' } },
      { icaoCode: { contains: query, mode: 'insensitive' } },
      { iataCode: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (filters.country) {
    where.country = { contains: filters.country, mode: 'insensitive' };
  }

  return where;
};

export const listAirports = async (filters: ListAirportsQueryInput) => {
  const where = buildWhere(filters);

  return prisma.airport.findMany({
    where,
    orderBy: [
      { country: 'asc' },
      { city: 'asc' },
    ],
  });
};

export const createAirport = async (data: CreateAirportInput) => {
  return prisma.airport.create({
    data,
  });
};

export const updateAirport = async (airportId: string, data: UpdateAirportInput) => {
  const airport = await prisma.airport.findUnique({ where: { id: airportId } });

  if (!airport) {
    throw new NotFoundError('Airport not found');
  }

  return prisma.airport.update({
    where: { id: airportId },
    data,
  });
};


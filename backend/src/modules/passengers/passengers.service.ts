import { NotFoundError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import type { CreatePassengerInput, UpdatePassengerInput } from './passengers.schemas';

const ensureFlight = async (flightId: string) => {
  const flight = await prisma.flight.findUnique({ where: { id: flightId } });
  if (!flight) {
    throw new NotFoundError('Flight not found');
  }
  return flight;
};

export const listPassengers = async (flightId: string) => {
  await ensureFlight(flightId);

  return prisma.passenger.findMany({
    where: { flightId },
    orderBy: { fullName: 'asc' },
    include: {
      baggageItems: true,
    },
  });
};

export const createPassenger = async (flightId: string, data: CreatePassengerInput) => {
  await ensureFlight(flightId);

  const passenger = await prisma.passenger.create({
    data: {
      ...data,
      flightId,
    },
  });

  await prisma.flight.update({
    where: { id: flightId },
    data: {
      passengerCount: { increment: 1 },
      updatedAt: new Date(),
    },
  });

  return passenger;
};

export const updatePassenger = async (
  flightId: string,
  passengerId: string,
  data: UpdatePassengerInput,
) => {
  const passenger = await prisma.passenger.findUnique({
    where: { id: passengerId },
  });

  if (!passenger || passenger.flightId !== flightId) {
    throw new NotFoundError('Passenger not found');
  }

  return prisma.passenger.update({
    where: { id: passengerId },
    data,
  });
};


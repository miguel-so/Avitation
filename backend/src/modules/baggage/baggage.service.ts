import { NotFoundError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import type { CreateBaggageInput, ScanBaggageInput } from './baggage.schemas';

const ensureFlight = async (flightId: string) => {
  const flight = await prisma.flight.findUnique({ where: { id: flightId } });
  if (!flight) {
    throw new NotFoundError('Flight not found');
  }
  return flight;
};

export const listBaggage = async (flightId: string) => {
  await ensureFlight(flightId);

  return prisma.baggageItem.findMany({
    where: { flightId },
    orderBy: { createdAt: 'asc' },
    include: { passenger: true },
  });
};

export const createBaggage = async (flightId: string, data: CreateBaggageInput) => {
  await ensureFlight(flightId);

  if (data.passengerId) {
    const passenger = await prisma.passenger.findUnique({
      where: { id: data.passengerId },
    });

    if (!passenger || passenger.flightId !== flightId) {
      throw new NotFoundError('Passenger not found on flight');
    }
  }

  return prisma.baggageItem.create({
    data: {
      ...data,
      flightId,
      status: data.status ?? 'created',
    },
  });
};

export const scanBaggage = async (baggageId: string, input: ScanBaggageInput) => {
  const baggage = await prisma.baggageItem.findUnique({
    where: { id: baggageId },
  });

  if (!baggage) {
    throw new NotFoundError('Baggage item not found');
  }

  const metadata = {
    ...(baggage.metadata as Record<string, unknown> | null),
    lastLocation: input.location ?? null,
  };

  return prisma.baggageItem.update({
    where: { id: baggageId },
    data: {
      status: input.status,
      lastScannedAt: input.scannedAt ?? new Date(),
      metadata,
    },
  });
};


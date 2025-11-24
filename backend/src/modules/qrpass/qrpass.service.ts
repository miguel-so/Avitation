import { NotFoundError } from '../../core/error';
import { generateSecureToken, hashPayload } from '../../lib/crypto';
import { prisma } from '../../lib/prisma';
import type { QrPassPayloadInput } from './qrpass.schemas';

const buildExpiresAt = (requested?: Date | null) => {
  if (requested) {
    return requested;
  }
  const expires = new Date();
  expires.setHours(expires.getHours() + 48);
  return expires;
};

export const generatePassengerQrPass = async (
  flightId: string,
  passengerId: string,
  input: QrPassPayloadInput,
  userId: string,
) => {
  const passenger = await prisma.passenger.findUnique({
    where: { id: passengerId },
    include: {
      flight: true,
    },
  });

  if (!passenger || passenger.flightId !== flightId) {
    throw new NotFoundError('Passenger not found on flight');
  }

  const token = generateSecureToken(24);
  const payloadHash = hashPayload(`${flightId}:${passengerId}:${token}`);
  const expiresAt = buildExpiresAt(input.expiresAt ?? null);

  const existing = await prisma.qRPass.findFirst({
    where: { flightId, passengerId, type: 'PASSENGER' },
  });

  if (existing) {
    return prisma.qRPass.update({
      where: { id: existing.id },
      data: {
        token,
        accessLevel: input.accessLevel,
        payloadHash,
        generatedById: userId,
        generatedAt: new Date(),
        expiresAt,
        status: 'active',
      },
    });
  }

  return prisma.qRPass.create({
    data: {
      token,
      payloadHash,
      flightId,
      passengerId,
      type: 'PASSENGER',
      accessLevel: input.accessLevel,
      generatedById: userId,
      generatedAt: new Date(),
      expiresAt,
    },
  });
};

export const generateCrewQrPass = async (
  flightId: string,
  crewId: string,
  input: QrPassPayloadInput,
  userId: string,
) => {
  const crew = await prisma.crewMember.findUnique({
    where: { id: crewId },
  });

  if (!crew || crew.flightId !== flightId) {
    throw new NotFoundError('Crew member not found on flight');
  }

  const token = generateSecureToken(24);
  const payloadHash = hashPayload(`${flightId}:${crewId}:${token}`);
  const expiresAt = buildExpiresAt(input.expiresAt ?? null);

  const existing = await prisma.qRPass.findFirst({
    where: { flightId, crewMemberId: crewId, type: 'CREW' },
  });

  if (existing) {
    return prisma.qRPass.update({
      where: { id: existing.id },
      data: {
        token,
        payloadHash,
        accessLevel: input.accessLevel ?? 'crew',
        generatedById: userId,
        generatedAt: new Date(),
        expiresAt,
        status: 'active',
      },
    });
  }

  return prisma.qRPass.create({
    data: {
      token,
      payloadHash,
      flightId,
      crewMemberId: crewId,
      type: 'CREW',
      accessLevel: input.accessLevel ?? 'crew',
      generatedById: userId,
      generatedAt: new Date(),
      expiresAt,
    },
  });
};

export const getQrPassPublic = async (token: string) => {
  const qrPass = await prisma.qRPass.findUnique({
    where: { token },
    include: {
      flight: {
        select: {
          id: true,
          uid: true,
          operatorName: true,
          departureAirportId: true,
          arrivalAirportId: true,
          scheduledDeparture: true,
        },
      },
      passenger: {
        select: {
          id: true,
          fullName: true,
          status: true,
        },
      },
      crewMember: {
        select: {
          id: true,
          fullName: true,
          rank: true,
        },
      },
    },
  });

  if (!qrPass) {
    throw new NotFoundError('QR Pass not found');
  }

  return qrPass;
};


import { NotFoundError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import type { GenerateDocumentInput } from './documents.schemas';

const ensureFlight = async (flightId: string) => {
  const flight = await prisma.flight.findUnique({ where: { id: flightId } });
  if (!flight) {
    throw new NotFoundError('Flight not found');
  }
  return flight;
};

export const listDocuments = async (flightId: string) => {
  await ensureFlight(flightId);

  return prisma.document.findMany({
    where: { flightId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getDocument = async (documentId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new NotFoundError('Document not found');
  }

  return document;
};

export const generateDocument = async (
  flightId: string,
  input: GenerateDocumentInput,
  userId: string,
) => {
  await ensureFlight(flightId);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const storageKey = `documents/${flightId}/${input.type.toLowerCase()}-${timestamp}.pdf`;

  return prisma.document.create({
    data: {
      flightId,
      type: input.type,
      status: 'GENERATED',
      storageKey,
      metadata: {
        templateVersion: input.templateVersion ?? 'default',
        options: input.options ?? {},
      },
      generatedById: userId,
      generatedAt: new Date(),
    },
  });
};


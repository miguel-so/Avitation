import { z } from 'zod';

export const flightDocumentsParamsSchema = z.object({
  flightId: z.string().uuid(),
});

export const documentIdParamsSchema = z.object({
  documentId: z.string().uuid(),
});

export const generateDocumentSchema = z.object({
  type: z.enum(['GENERAL_DECLARATION', 'PASSENGER_MANIFEST', 'CREW_LIST', 'BAGGAGE_REPORT']),
  templateVersion: z.string().optional(),
  options: z.record(z.unknown()).optional(),
});

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;


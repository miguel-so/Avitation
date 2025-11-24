import type { Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import type { AuthenticatedRequest } from '../../types/express';
import {
  documentIdParamsSchema,
  flightDocumentsParamsSchema,
  generateDocumentSchema,
} from './documents.schemas';
import { generateDocument, getDocument, listDocuments } from './documents.service';

export const listDocumentsHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = flightDocumentsParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const documents = await listDocuments(params.data.flightId);
  return ok(res, documents);
};

export const getDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = documentIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid document id', params.error.flatten());
  }

  const document = await getDocument(params.data.documentId);
  return ok(res, document);
};

export const generateDocumentHandler = async (req: AuthenticatedRequest, res: Response) => {
  const params = flightDocumentsParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const body = generateDocumentSchema.safeParse(req.body);

  if (!body.success) {
    throw new ValidationError('Invalid document payload', body.error.flatten());
  }

  const document = await generateDocument(params.data.flightId, body.data, req.user.id);
  return created(res, document);
};

export const generateGeneralDeclarationHandler = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const params = flightDocumentsParamsSchema.safeParse(req.params);

  if (!params.success) {
    throw new ValidationError('Invalid flight id', params.error.flatten());
  }

  const document = await generateDocument(
    params.data.flightId,
    { type: 'GENERAL_DECLARATION' },
    req.user.id,
  );

  return created(res, document);
};


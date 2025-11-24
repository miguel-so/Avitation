import { Router } from 'express';

import { authenticate } from '../../middleware/auth';
import { requireRoles } from '../../middleware/permissions';
import {
  generateDocumentHandler,
  generateGeneralDeclarationHandler,
  getDocumentHandler,
  listDocumentsHandler,
} from './documents.controller';

const flightDocumentsRouter = Router({ mergeParams: true });
const detailRouter = Router();

flightDocumentsRouter.use(authenticate);
detailRouter.use(authenticate);

flightDocumentsRouter.get(
  '/:flightId/documents',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'AuthorityUser'),
  listDocumentsHandler,
);

flightDocumentsRouter.post(
  '/:flightId/documents/generate',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  generateDocumentHandler,
);

flightDocumentsRouter.post(
  '/:flightId/general-declaration/generate',
  requireRoles('VictorAdmin', 'OperatorAdmin'),
  generateGeneralDeclarationHandler,
);

detailRouter.get(
  '/:documentId',
  requireRoles('VictorAdmin', 'OperatorAdmin', 'AuthorityUser'),
  getDocumentHandler,
);

export const documentsRouter = flightDocumentsRouter;
export const documentDetailRouter = detailRouter;


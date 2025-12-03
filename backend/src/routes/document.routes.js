import { Router } from "express";
import { body } from "express-validator";
import {
  handleListDocuments,
  handleGenerateGeneralDeclaration,
} from "../controllers/document-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const documentRouter = Router();

documentRouter.get(
  "/flights/:flightId/documents",
  authenticate,
  handleListDocuments
);

documentRouter.post(
  "/flights/:flightId/general-declaration/generate",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  [
    body("templateId").optional().isString(),
    body("signatureRequired").optional().isBoolean(),
  ],
  handleGenerateGeneralDeclaration
);


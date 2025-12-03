import { Router } from "express";
import { body } from "express-validator";
import {
  handleCreateQrPass,
  handleGetQrPassPublic,
  handleUpdateQrPass,
} from "../controllers/qr-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const qrRouter = Router();

const creationValidators = [
  body("accessLevel")
    .optional()
    .isIn(["PASSENGER", "CREW", "HANDLER", "AUTHORITY"]),
  body("expiresAt").optional().isISO8601(),
];

qrRouter.post(
  "/flights/:flightId/passengers/:passengerId/qr-pass",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "Handler"),
  creationValidators,
  (req, _res, next) => {
    req.body.entityType = "PASSENGER";
    req.body.entityId = req.params.passengerId;
    next();
  },
  handleCreateQrPass
);

qrRouter.post(
  "/flights/:flightId/crew/:crewId/qr-pass",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  creationValidators,
  (req, _res, next) => {
    req.body.entityType = "CREW";
    req.body.entityId = req.params.crewId;
    next();
  },
  handleCreateQrPass
);

qrRouter.put(
  "/qr-pass/:qrId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "Handler"),
  [
    body("status").isIn(["ACTIVE", "REVOKED", "EXPIRED"]),
    body("expiresAt").optional().isISO8601(),
    body("sentAt").optional().isISO8601(),
  ],
  handleUpdateQrPass
);

qrRouter.get("/qr-pass/:token", handleGetQrPassPublic);


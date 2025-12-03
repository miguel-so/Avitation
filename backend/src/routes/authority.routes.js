import { Router } from "express";
import { body } from "express-validator";
import {
  handleListAuthorityNotifications,
  handleCreateAuthorityNotification,
  handleUpdateAuthorityNotification,
} from "../controllers/authority-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const authorityRouter = Router();

const creationValidators = [
  body("authorityType").isString().notEmpty(),
  body("destination").optional().isString(),
  body("documentId").optional().isString(),
];

authorityRouter.get(
  "/flights/:flightId/authority-notifications",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "AuthorityUser"),
  handleListAuthorityNotifications
);

authorityRouter.post(
  "/flights/:flightId/authority-notifications",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  creationValidators,
  handleCreateAuthorityNotification
);

authorityRouter.put(
  "/authority-notifications/:notificationId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "AuthorityUser"),
  [
    body("status").isIn(["PENDING", "SENT", "FAILED"]),
    body("responseMessage").optional().isString(),
    body("sentAt").optional().isISO8601(),
    body("retryCount").optional().isInt({ min: 0 }),
  ],
  handleUpdateAuthorityNotification
);


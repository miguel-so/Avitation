import { Router } from "express";
import { body } from "express-validator";
import {
  handleListBaggage,
  handleCreateBaggage,
  handleUpdateBaggage,
  handleDeleteBaggage,
} from "../controllers/baggage-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const baggageRouter = Router();

const createValidators = [
  body("tagCode").isString().notEmpty(),
  body("weightKg").optional().isFloat({ min: 0 }),
  body("pieces").optional().isInt({ min: 1 }),
  body("status")
    .optional()
    .isIn(["CREATED", "CHECKED_IN", "LOADED", "UNLOADED", "MISSING"]),
];

const updateValidators = [
  body("status")
    .isIn(["CREATED", "CHECKED_IN", "LOADED", "UNLOADED", "MISSING"])
    .withMessage("Status is required"),
  body("lastScannedAt").optional().isISO8601(),
  body("lastScannedLocation").optional().isString(),
];

baggageRouter.get(
  "/flights/:flightId/baggage",
  authenticate,
  handleListBaggage
);

baggageRouter.post(
  "/flights/:flightId/baggage",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "Handler"),
  createValidators,
  handleCreateBaggage
);

baggageRouter.put(
  "/baggage/:baggageId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "Handler"),
  updateValidators,
  handleUpdateBaggage
);

baggageRouter.delete(
  "/baggage/:baggageId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  handleDeleteBaggage
);


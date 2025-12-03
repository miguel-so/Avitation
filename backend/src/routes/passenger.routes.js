import { Router } from "express";
import { body } from "express-validator";
import {
  handleListPassengers,
  handleCreatePassenger,
  handleUpdatePassenger,
  handleDeletePassenger,
} from "../controllers/passenger-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const passengerRouter = Router();

const passengerValidators = [
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  body("gender").optional().isIn(["MALE", "FEMALE", "OTHER"]),
  body("dateOfBirth").optional().isISO8601(),
  body("passportExpiry").optional().isISO8601(),
  body("arrivalStatus")
    .optional()
    .isIn(["SCHEDULED", "ARRIVED", "READY_FOR_BOARDING", "ON_BOARD", "OFFLOADED"]),
  body("baggageCount").optional().isInt({ min: 0 }),
];

passengerRouter.get(
  "/flights/:flightId/passengers",
  authenticate,
  handleListPassengers
);

passengerRouter.post(
  "/flights/:flightId/passengers",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "Handler"),
  passengerValidators,
  handleCreatePassenger
);

passengerRouter.put(
  "/passengers/:passengerId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin", "Handler"),
  passengerValidators,
  handleUpdatePassenger
);

passengerRouter.delete(
  "/passengers/:passengerId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  handleDeletePassenger
);


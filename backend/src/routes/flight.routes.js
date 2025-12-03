import { Router } from "express";
import { body } from "express-validator";
import {
  handleListFlights,
  handleGetFlight,
  handleCreateFlight,
  handleUpdateFlight,
  handleDeleteFlight,
} from "../controllers/flight-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const flightRouter = Router();

flightRouter.get("/", authenticate, handleListFlights);

const flightValidators = [
  body("operatorId").isString().notEmpty(),
  body("aircraftTypeId").isString().notEmpty(),
  body("originAirportId").isString().notEmpty(),
  body("destinationAirportId").isString().notEmpty(),
  body("departureDate").isISO8601().withMessage("departureDate must be ISO date"),
  body("scheduledDeparture")
    .optional()
    .isISO8601()
    .withMessage("scheduledDeparture must be ISO date time"),
  body("scheduledArrival")
    .optional()
    .isISO8601()
    .withMessage("scheduledArrival must be ISO date time"),
  body("status").optional().isIn(["PLANNED", "READY", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  body("turnaroundStatus")
    .optional()
    .isIn(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]),
  body("purpose")
    .optional()
    .isIn(["COMMERCIAL", "PRIVATE", "CARGO", "OTHER"]),
];

flightRouter.post(
  "/",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  flightValidators,
  handleCreateFlight
);

flightRouter.get("/:id", authenticate, handleGetFlight);

flightRouter.put(
  "/:id",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  flightValidators,
  handleUpdateFlight
);

flightRouter.delete(
  "/:id",
  authenticate,
  requireRoles("VictorAdmin"),
  handleDeleteFlight
);


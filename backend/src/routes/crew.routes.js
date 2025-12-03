import { Router } from "express";
import { body } from "express-validator";
import {
  handleListCrew,
  handleCreateCrew,
  handleUpdateCrew,
  handleDeleteCrew,
} from "../controllers/crew-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const crewRouter = Router();

const crewValidators = [
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  body("dutyType").optional().isIn(["OPERATING", "DEADHEADING", "STANDBY"]),
  body("licenseExpiry").optional().isISO8601(),
  body("arrivalStatus").optional().isIn(["SCHEDULED", "ARRIVED", "ON_BOARD"]),
];

crewRouter.get("/flights/:flightId/crew", authenticate, handleListCrew);

crewRouter.post(
  "/flights/:flightId/crew",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  crewValidators,
  handleCreateCrew
);

crewRouter.put(
  "/crew/:crewId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  crewValidators,
  handleUpdateCrew
);

crewRouter.delete(
  "/crew/:crewId",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  handleDeleteCrew
);


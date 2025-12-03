import { Router } from "express";
import {
  handleListAirports,
  handleListAircraftTypes,
  handleListOperators,
  handleListRoles,
  handleListTemplates,
} from "../controllers/reference-controller.js";
import { authenticate } from "../middleware/auth.js";

export const referenceRouter = Router();

referenceRouter.get("/airports", authenticate, handleListAirports);
referenceRouter.get("/aircraft-types", authenticate, handleListAircraftTypes);
referenceRouter.get("/operators", authenticate, handleListOperators);
referenceRouter.get("/roles", authenticate, handleListRoles);
referenceRouter.get("/templates", authenticate, handleListTemplates);


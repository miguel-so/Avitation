import { Router } from "express";
import { handleListUsers } from "../controllers/user-controller.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.get(
  "/users",
  authenticate,
  requireRoles("VictorAdmin", "OperatorAdmin"),
  handleListUsers
);


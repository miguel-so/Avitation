import { Router } from "express";
import { body } from "express-validator";
import { login, refresh, logout } from "../controllers/auth-controller.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password is required"),
  ],
  login
);

authRouter.post(
  "/refresh",
  [body("refreshToken").isString().withMessage("Refresh token is required")],
  refresh
);

authRouter.post(
  "/logout",
  [body("refreshToken").optional().isString()],
  logout
);


import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const signAccessToken = (payload) =>
  jwt.sign(payload, config.security.jwtSecret, {
    expiresIn: config.security.jwtExpiresIn,
  });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, config.security.refreshSecret, {
    expiresIn: config.security.refreshExpiresIn,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, config.security.jwtSecret);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, config.security.refreshSecret);


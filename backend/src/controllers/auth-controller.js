import { validationResult } from "express-validator";
import { differenceInSeconds } from "date-fns";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import { findUserByEmail, updateLastLogin } from "../services/user-service.js";
import {
  createRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokensForUser,
  findRefreshToken,
} from "../services/auth-service.js";
import { comparePassword } from "../utils/password.js";
import { createId } from "../utils/uid.js";

const formatUserResponse = (user) => ({
  id: user.id,
  email: user.email,
  fullName: user.full_name,
  role: user.role_name,
});

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed", errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await findUserByEmail(email.toLowerCase());

  if (!user || user.status !== "ACTIVE") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await deleteRefreshTokensForUser(user.id);

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role_name,
    fullName: user.full_name,
  });

  const refreshToken = signRefreshToken({
    sub: user.id,
    email: user.email,
    role: user.role_name,
  });

  const { exp } = verifyRefreshToken(refreshToken);
  const expiresAt = new Date(exp * 1000);
  await createRefreshToken(createId(), user.id, refreshToken, expiresAt);
  await updateLastLogin(user.id);

  res.json({
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: differenceInSeconds(expiresAt, new Date()),
    user: formatUserResponse(user),
  });
};

export const refresh = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed", errors: errors.array() });
  }

  const { refreshToken } = req.body;
  const record = await findRefreshToken(refreshToken);

  if (!record) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    await deleteRefreshToken(refreshToken);
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  await deleteRefreshToken(refreshToken);

  const newAccessToken = signAccessToken({
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  });
  const newRefreshToken = signRefreshToken({
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  });
  const { exp } = verifyRefreshToken(newRefreshToken);

  const expiryDate = new Date(exp * 1000);
  await createRefreshToken(createId(), decoded.sub, newRefreshToken, expiryDate);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    tokenType: "Bearer",
    expiresIn: differenceInSeconds(expiryDate, new Date()),
  });
};

export const logout = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Validation failed", errors: errors.array() });
  }

  const { refreshToken } = req.body;
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  res.status(200).json({ message: "Logged out" });
};


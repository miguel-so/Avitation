import { verifyAccessToken } from "../utils/token.js";
import { logger } from "../logger.js";

export const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    logger.warn("Token verification failed", { error: error.message });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (allowedRoles.length === 0) {
    return next();
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }

  return next();
};


import { logger } from "../logger.js";

export const notFoundHandler = (_req, res, _next) => {
  res.status(404).json({ message: "Resource not found" });
};

export const errorHandler = (err, _req, res, _next) => {
  logger.error("Unhandled error", { error: err });
  const status = err.statusCode ?? 500;
  res.status(status).json({
    message: err.message ?? "Unexpected error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};


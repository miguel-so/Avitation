import winston from "winston";
import { isProduction } from "./config.js";

const { combine, timestamp, colorize, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: time, stack, ...meta }) => {
  const base = `${time} ${level}: ${stack ?? message}`;
  const metaKeys = Object.keys(meta);
  if (metaKeys.length === 0) {
    return base;
  }
  return `${base} ${JSON.stringify(meta)}`;
});

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
      ),
    }),
  ],
});


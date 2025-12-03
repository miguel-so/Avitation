import dotenv from "dotenv";

dotenv.config();

const numberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: numberOrDefault(process.env.PORT, 4000),
  database: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: numberOrDefault(process.env.DB_PORT, 3306),
    user: process.env.DB_USER ?? "victor_app",
    password: process.env.DB_PASSWORD ?? "secret",
    name: process.env.DB_NAME ?? "victor",
  },
  security: {
    jwtSecret: process.env.JWT_SECRET ?? "change-me-super-secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    refreshSecret:
      process.env.REFRESH_TOKEN_SECRET ?? "change-me-refresh-secret",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
  },
  features: {
    enableEmail: process.env.ENABLE_EMAIL === "true",
  },
};

export const isProduction = config.env === "production";


import mysql from "mysql2/promise";
import { config } from "../config.js";
import { logger } from "../logger.js";

let pool;

export const getPool = () => {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
  });

  logger.info("MySQL connection pool initialised", {
    host: config.database.host,
    database: config.database.name,
  });

  return pool;
};


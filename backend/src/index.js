import { config } from "./config.js";
import { createApp } from "./app.js";
import { getPool } from "./db/pool.js";
import { createTables } from "./db/schema.js";
import { seedDatabase } from "./db/seed.js";
import { logger } from "./logger.js";

const start = async () => {
  try {
    getPool();
    await createTables();
    await seedDatabase();

    const app = createApp();
    app.listen(config.port, () => {
      logger.info(`Victor backend listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start backend", { error });
    process.exit(1);
  }
};

start();


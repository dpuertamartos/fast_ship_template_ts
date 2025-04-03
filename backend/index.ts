import { app, setupApp } from './app';
import { connectToDatabase } from './utils/db';
import { runFlywayMigrations } from './utils/flyway';
import { PORT } from './utils/config';
import logger from './utils/logger';

const start = async () => {
  await connectToDatabase();
  await runFlywayMigrations();
  
  setupApp();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

void start();


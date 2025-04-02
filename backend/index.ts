import { app, setupApp } from './app';
import { connectToDatabase } from './utils/db';
import { PORT } from './utils/config';
import logger from './utils/logger';
const start = async () => {
  await connectToDatabase();
  setupApp();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

void start();


import { app, setupApp } from './app';
import { connectToDatabase } from './utils/db';
import { PORT } from './utils/config';

const start = async () => {
  await connectToDatabase();
  setupApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void start();


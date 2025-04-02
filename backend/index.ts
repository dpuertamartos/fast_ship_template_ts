import { app, setupApp } from './app';
import { PORT } from './utils/config';

const start = () => {
  setupApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();


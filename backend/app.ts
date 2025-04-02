import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
const app = express();

const setupApp = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cors());
  app.use(express.json());
  app.get('/ping', (_req, res) => {
    logger.info('someone pinged here');
    res.send('pong!');
  });
};

export { app, setupApp };
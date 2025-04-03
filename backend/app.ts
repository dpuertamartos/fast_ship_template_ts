import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import basicMiddleware from './utils/basicMiddleware';
const app = express();

const setupApp = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cors());
  app.use(express.json());
  app.use(basicMiddleware.requestLogger);
  app.get('/ping', (_req, res) => {
    logger.info('someone pinged here');
    res.send('pong!');
  });
  app.use(basicMiddleware.unknownEndpoint);
  app.use(basicMiddleware.errorHandler as express.ErrorRequestHandler);
};

export { app, setupApp };
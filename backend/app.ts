import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import basicMiddleware from './utils/basicMiddleware';
import userRouter from './controller/user';
const app = express();

const setupApp = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cors());
  app.use(express.json());
  app.use(basicMiddleware.requestLogger);
  app.get('/healthcheck', (_req, res) => {
    logger.info('healthcheck requested');
    res.send('alive!');
  });
  app.use('/api/users', userRouter);
  app.use(basicMiddleware.unknownEndpoint);
  app.use(basicMiddleware.errorHandler as express.ErrorRequestHandler);
};

export { app, setupApp };
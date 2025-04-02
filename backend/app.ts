import express from 'express';
import cors from 'cors';
const app = express();

const setupApp = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cors());
  app.use(express.json());
  app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong!');
  });
};

export { app, setupApp };
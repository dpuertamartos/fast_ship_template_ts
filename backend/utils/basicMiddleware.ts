import logger from './logger';
import { Request, Response, NextFunction } from 'express';

interface SanitizedBody {
  [key: string]: unknown;
  password?: string;
}

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sanitizedBody: SanitizedBody = { ...req.body };

  if (sanitizedBody.password) {
    sanitizedBody.password = '***';
  }

  const bodyString = JSON.stringify(sanitizedBody, (_key: string, value: unknown) =>
    typeof value === 'object' && value !== null ? value : String(value)
  );
  logger.info(`Method: ${req.method}; Path: ${req.url}; Body: ${bodyString}`);
  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  logger.error('error:', error);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing or invalid' });  // Update this to 401
  } else if (error.name === 'TokenExpiredError') { // Handle expired token
    return res.status(401).json({ error: 'token expired' });  // Respond with 401 if the token has expired
  }

  next(error);
  return;
};

const basicMiddleware = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
};

export default basicMiddleware;
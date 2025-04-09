import logger from './logger';
import { Request, Response, NextFunction } from 'express';
import { SanitizedBody } from '../types/utils';
import { ZodError } from 'zod';
import { isHttpError } from 'http-errors';

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

const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error handled:', error);

  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors });
  };

  if (isHttpError(error)) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof Error) {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token missing or invalid' });
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'CastError') { // Example: Malformatted ID in URL param
        return res.status(400).send({ error: 'Malformatted ID' });
    } else if (error.name === 'ValidationError') { // Example: Sequelize validation
        return res.status(400).json({ error: error.message });
    }
    // Add other specific error.name checks if needed
  }

  // Fallback for truly unexpected errors (not Zod, not HttpError, not other known Error names)
  return res.status(500).json({ error: 'An unexpected internal server error occurred.' });
};

const basicMiddleware = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
};

export default basicMiddleware;
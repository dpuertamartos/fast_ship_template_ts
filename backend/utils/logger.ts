import { NODE_ENV } from './config';

interface Logger {
  info: (...params: unknown[]) => void;
  error: (...params: unknown[]) => void;
  warn: (...params: unknown[]) => void;
  debug: (...params: unknown[]) => void;
}

const info = (...params: unknown[]) => {
  console.log(...params);
};

const error = (...params: unknown[]) => {
  console.error(...params);
};

const warn = (...params: unknown[]) => {
  console.warn(...params);
};

const debug = (...params: unknown[]) => {
  if (NODE_ENV !== 'prod') {
    console.debug(...params);
  }
};

const logger: Logger = {
  info,
  error,
  warn,
  debug
};

export default logger;
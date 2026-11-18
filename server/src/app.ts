import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { httpLogger, REQUEST_ID_HEADER } from './middlewares/http-logger.js';
import { notFound } from './middlewares/not-found.js';
import { apiRouter } from './routes/index.js';

export const API_PREFIX = '/api/v1';
const JSON_BODY_LIMIT = '1mb';

/**
 * Builds the Express application without starting a server,
 * so tests can exercise it in-process with Supertest.
 */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(httpLogger);
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      exposedHeaders: [REQUEST_ID_HEADER],
    }),
  );
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  app.use(API_PREFIX, apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

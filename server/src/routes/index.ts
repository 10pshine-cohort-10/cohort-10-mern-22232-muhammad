import { Router } from 'express';
import { healthRouter } from '../modules/health/health.routes.js';

/** Versioned API router mounted at `/api/v1`. Feature modules register their routes here. */
export const apiRouter: Router = Router();

apiRouter.use('/health', healthRouter);

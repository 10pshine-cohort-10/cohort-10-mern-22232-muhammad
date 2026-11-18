import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../utils/errors.js';

/** Catches requests that matched no route and forwards a 404 to the global error handler. */
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND'));
}

import type { Response } from 'express';
import type { ErrorDetail } from './errors.js';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface SuccessBody<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details: ErrorDetail[];
    requestId?: string;
  };
}

/** Sends the standard success envelope: `{ success: true, data, meta? }`. */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: PaginationMeta,
): void {
  const body: SuccessBody<T> = meta ? { success: true, data, meta } : { success: true, data };
  res.status(statusCode).json(body);
}

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { AppError, BadRequestError, ValidationError } from '../utils/errors.js';
import type { ErrorBody } from '../utils/http-response.js';
import { toErrorDetails } from './validate.js';

interface BodyParserError {
  status: number;
  type: string;
}

function isBodyParserError(err: unknown): err is BodyParserError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'type' in err &&
    'status' in err &&
    typeof (err as BodyParserError).type === 'string' &&
    typeof (err as BodyParserError).status === 'number'
  );
}

/** Converts any thrown value into a known AppError, or `null` when it is unexpected. */
export function normalizeError(err: unknown): AppError | null {
  if (err instanceof AppError) return err;
  if (err instanceof ZodError) return new ValidationError(toErrorDetails(err));

  if (isBodyParserError(err)) {
    if (err.type === 'entity.parse.failed') {
      return new BadRequestError('Request body contains invalid JSON', 'INVALID_JSON');
    }
    if (err.type === 'entity.too.large') {
      return new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large');
    }
    if (err.status >= 400 && err.status < 500) {
      return new AppError(err.status, 'BAD_REQUEST', 'Malformed request');
    }
  }

  return null;
}

/**
 * Global error-handling middleware (must be registered last).
 * - Known errors → their status code and a meaningful message.
 * - Unknown errors → generic 500; the stack trace is logged, never sent to the client.
 * Every response carries the request id so a user-reported error can be traced in the logs.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const log = req.log ?? logger;
  const known = normalizeError(err);
  const requestId = typeof req.id === 'string' ? req.id : undefined;

  if (known) {
    log.warn(
      { err: known, code: known.code, statusCode: known.statusCode },
      `Handled error: ${known.message}`,
    );
  } else {
    log.error({ err }, 'Unhandled error');
  }

  // A response is already streaming: let Express close the connection.
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = known?.statusCode ?? 500;
  const body: ErrorBody = {
    success: false,
    error: {
      code: known?.code ?? 'INTERNAL_SERVER_ERROR',
      message: known?.message ?? 'Something went wrong. Please try again later.',
      details: known?.details ?? [],
      ...(requestId ? { requestId } : {}),
    },
  };

  res.status(statusCode).json(body);
}

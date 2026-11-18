import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodType } from 'zod';
import { ValidationError, type ErrorDetail } from '../utils/errors.js';

export interface RequestSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export function toErrorDetails(error: ZodError): ErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : undefined,
    message: issue.message,
  }));
}

/**
 * Validates `req.body`, `req.query` and `req.params` against Zod schemas.
 * Valid data replaces the raw input (so handlers receive parsed, coerced values);
 * invalid data short-circuits with a 400 `VALIDATION_ERROR` listing every failing field.
 */
export function validate(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const details: ErrorDetail[] = [];

    for (const key of ['params', 'query', 'body'] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        details.push(...toErrorDetails(result.error));
        continue;
      }

      // Express 5 exposes `req.query` as a getter, so it must be redefined rather than assigned.
      Object.defineProperty(req, key, {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    if (details.length > 0) {
      next(new ValidationError(details));
      return;
    }
    next();
  };
}

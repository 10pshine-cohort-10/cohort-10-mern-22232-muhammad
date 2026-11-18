export interface ErrorDetail {
  field?: string;
  message: string;
}

/**
 * Base class for all expected (operational) errors.
 * Anything that is NOT an AppError is treated as an unexpected 500 by the global error handler.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: ErrorDetail[];
  public readonly isOperational = true;

  constructor(statusCode: number, code: string, message: string, details: ErrorDetail[] = []) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details: ErrorDetail[] = []) {
    super(400, code, message, details);
  }
}

export class ValidationError extends AppError {
  constructor(details: ErrorDetail[], message = 'Validation failed') {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(403, 'FORBIDDEN', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', code = 'CONFLICT') {
    super(409, code, message);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(429, 'TOO_MANY_REQUESTS', message);
  }
}

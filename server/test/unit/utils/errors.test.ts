import { expect } from 'chai';
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from '../../../src/utils/errors.js';

describe('utils/errors', () => {
  it('AppError stores status, code, message and details', () => {
    const error = new AppError(418, 'TEAPOT', 'I am a teapot', [{ message: 'short and stout' }]);

    expect(error).to.be.instanceOf(Error);
    expect(error.statusCode).to.equal(418);
    expect(error.code).to.equal('TEAPOT');
    expect(error.message).to.equal('I am a teapot');
    expect(error.details).to.deep.equal([{ message: 'short and stout' }]);
    expect(error.isOperational).to.equal(true);
    expect(error.name).to.equal('AppError');
  });

  const cases: Array<[string, AppError, number, string]> = [
    ['BadRequestError', new BadRequestError(), 400, 'BAD_REQUEST'],
    [
      'ValidationError',
      new ValidationError([{ field: 'email', message: 'Invalid' }]),
      400,
      'VALIDATION_ERROR',
    ],
    ['UnauthorizedError', new UnauthorizedError(), 401, 'UNAUTHORIZED'],
    ['ForbiddenError', new ForbiddenError(), 403, 'FORBIDDEN'],
    ['NotFoundError', new NotFoundError(), 404, 'NOT_FOUND'],
    ['ConflictError', new ConflictError(), 409, 'CONFLICT'],
    ['TooManyRequestsError', new TooManyRequestsError(), 429, 'TOO_MANY_REQUESTS'],
  ];

  for (const [name, error, statusCode, code] of cases) {
    it(`${name} maps to ${statusCode} ${code}`, () => {
      expect(error).to.be.instanceOf(AppError);
      expect(error.name).to.equal(name);
      expect(error.statusCode).to.equal(statusCode);
      expect(error.code).to.equal(code);
      expect(error.message).to.be.a('string').and.not.be.empty;
    });
  }

  it('allows custom messages and codes', () => {
    const error = new NotFoundError('Note not found', 'NOTE_NOT_FOUND');
    expect(error.message).to.equal('Note not found');
    expect(error.code).to.equal('NOTE_NOT_FOUND');
  });
});

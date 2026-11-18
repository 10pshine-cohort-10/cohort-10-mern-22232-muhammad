import { expect } from 'chai';
import type { Request } from 'express';
import sinon from 'sinon';
import { z } from 'zod';
import { errorHandler, normalizeError } from '../../../src/middlewares/error-handler.js';
import { AppError, NotFoundError, ValidationError } from '../../../src/utils/errors.js';
import { createMockRequest, createMockResponse, createNext } from '../../helpers/http-mocks.js';

function createLoggedRequest() {
  const log = { warn: sinon.spy(), error: sinon.spy() };
  const req = createMockRequest({ id: 'req-123' } as Partial<Request>);
  (req as unknown as { log: typeof log }).log = log;
  return { req, log };
}

describe('middlewares/error-handler', () => {
  describe('normalizeError', () => {
    it('returns AppErrors unchanged', () => {
      const error = new NotFoundError();
      expect(normalizeError(error)).to.equal(error);
    });

    it('converts ZodError into ValidationError', () => {
      const result = z.object({ email: z.email() }).safeParse({ email: 'nope' });
      const normalized = normalizeError(result.error);
      expect(normalized).to.be.instanceOf(ValidationError);
      expect(normalized?.details[0]?.field).to.equal('email');
    });

    it('maps malformed JSON bodies to 400 INVALID_JSON', () => {
      const normalized = normalizeError({ type: 'entity.parse.failed', status: 400 });
      expect(normalized?.statusCode).to.equal(400);
      expect(normalized?.code).to.equal('INVALID_JSON');
    });

    it('maps oversized bodies to 413 PAYLOAD_TOO_LARGE', () => {
      const normalized = normalizeError({ type: 'entity.too.large', status: 413 });
      expect(normalized?.statusCode).to.equal(413);
      expect(normalized?.code).to.equal('PAYLOAD_TOO_LARGE');
    });

    it('maps other 4xx body-parser errors to a generic bad request', () => {
      const normalized = normalizeError({ type: 'charset.unsupported', status: 415 });
      expect(normalized?.statusCode).to.equal(415);
      expect(normalized?.code).to.equal('BAD_REQUEST');
    });

    it('returns null for unexpected errors', () => {
      expect(normalizeError(new Error('boom'))).to.equal(null);
      expect(normalizeError('string error')).to.equal(null);
      expect(normalizeError({ type: 'weird', status: 500 })).to.equal(null);
    });
  });

  describe('errorHandler', () => {
    it('responds with the status, code and request id of a known error and logs a warning', () => {
      const { req, log } = createLoggedRequest();
      const { res, status, json } = createMockResponse();

      errorHandler(new NotFoundError('Note not found', 'NOTE_NOT_FOUND'), req, res, createNext());

      expect(status.calledOnceWithExactly(404)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({
        success: false,
        error: {
          code: 'NOTE_NOT_FOUND',
          message: 'Note not found',
          details: [],
          requestId: 'req-123',
        },
      });
      expect(log.warn.calledOnce).to.equal(true);
      expect(log.error.called).to.equal(false);
    });

    it('hides internal details of unexpected errors behind a generic 500 and logs them', () => {
      const { req, log } = createLoggedRequest();
      const { res, status, json } = createMockResponse();

      errorHandler(new Error('database exploded'), req, res, createNext());

      expect(status.calledOnceWithExactly(500)).to.equal(true);
      const body = json.firstCall.args[0] as { error: { code: string; message: string } };
      expect(body.error.code).to.equal('INTERNAL_SERVER_ERROR');
      expect(body.error.message).to.not.include('database');
      expect(log.error.calledOnce).to.equal(true);
    });

    it('includes validation details in the response', () => {
      const { req } = createLoggedRequest();
      const { res, json } = createMockResponse();
      const details = [{ field: 'title', message: 'Title is required' }];

      errorHandler(new ValidationError(details), req, res, createNext());

      const body = json.firstCall.args[0] as { error: { details: unknown } };
      expect(body.error.details).to.deep.equal(details);
    });

    it('omits requestId when the request has none and falls back to the root logger', () => {
      const req = createMockRequest();
      const { res, json } = createMockResponse();

      errorHandler(new AppError(400, 'X', 'x'), req, res, createNext());

      const body = json.firstCall.args[0] as { error: Record<string, unknown> };
      expect(body.error).to.not.have.property('requestId');
    });

    it('delegates to Express when headers were already sent', () => {
      const { req } = createLoggedRequest();
      const { res, status } = createMockResponse({ headersSent: true });
      const next = createNext();
      const error = new Error('stream failed');

      errorHandler(error, req, res, next);

      expect(status.called).to.equal(false);
      expect(next.calledOnceWithExactly(error)).to.equal(true);
    });
  });
});

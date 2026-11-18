import type { IncomingMessage, ServerResponse } from 'node:http';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  REQUEST_ID_HEADER,
  resolveLogLevel,
  resolveRequestId,
} from '../../../src/middlewares/http-logger.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function createPair(headerValue?: string | string[]) {
  const req = { headers: headerValue === undefined ? {} : { [REQUEST_ID_HEADER]: headerValue } };
  const setHeader = sinon.spy();
  const res = { setHeader };
  return {
    req: req as unknown as IncomingMessage,
    res: res as unknown as ServerResponse,
    setHeader,
  };
}

describe('middlewares/http-logger', () => {
  describe('resolveRequestId', () => {
    it('reuses a well-formed incoming request id and echoes it back', () => {
      const { req, res, setHeader } = createPair('trace-abc_123');

      expect(resolveRequestId(req, res)).to.equal('trace-abc_123');
      expect(setHeader.calledOnceWithExactly(REQUEST_ID_HEADER, 'trace-abc_123')).to.equal(true);
    });

    it('generates a UUID when the header is missing', () => {
      const { req, res } = createPair();
      expect(resolveRequestId(req, res)).to.match(UUID_PATTERN);
    });

    it('ignores malformed or injected ids', () => {
      for (const value of ['bad id with spaces', 'x'.repeat(65), ['a', 'b']]) {
        const { req, res } = createPair(value);
        expect(resolveRequestId(req, res)).to.match(UUID_PATTERN);
      }
    });
  });

  describe('resolveLogLevel', () => {
    const req = {} as IncomingMessage;
    const withStatus = (statusCode: number) => ({ statusCode }) as ServerResponse;

    it('uses info for successful responses', () => {
      expect(resolveLogLevel(req, withStatus(200))).to.equal('info');
      expect(resolveLogLevel(req, withStatus(304))).to.equal('info');
    });

    it('uses warn for client errors', () => {
      expect(resolveLogLevel(req, withStatus(404))).to.equal('warn');
    });

    it('uses error for server errors or thrown errors', () => {
      expect(resolveLogLevel(req, withStatus(500))).to.equal('error');
      expect(resolveLogLevel(req, withStatus(200), new Error('x'))).to.equal('error');
    });
  });
});

import type { NextFunction, Request, Response } from 'express';
import sinon, { type SinonSpy, type SinonStub } from 'sinon';

export interface MockResponse {
  res: Response;
  status: SinonStub;
  json: SinonStub;
}

/** Creates a chainable Express `res` double: `res.status(...).json(...)`. */
export function createMockResponse(overrides: Partial<Response> = {}): MockResponse {
  const res = { headersSent: false, ...overrides } as Response;
  const status = sinon.stub().returns(res);
  const json = sinon.stub().returns(res);
  Object.assign(res, { status, json });
  return { res, status, json };
}

export function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    method: 'GET',
    originalUrl: '/',
    body: {},
    query: {},
    params: {},
    headers: {},
    ...overrides,
  } as Request;
}

export function createNext(): NextFunction & SinonSpy {
  return sinon.spy() as unknown as NextFunction & SinonSpy;
}

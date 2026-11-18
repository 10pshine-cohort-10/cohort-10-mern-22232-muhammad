import { expect } from 'chai';
import type { Request } from 'express';
import { z } from 'zod';
import { validate } from '../../../src/middlewares/validate.js';
import { ValidationError } from '../../../src/utils/errors.js';
import { createMockRequest, createMockResponse, createNext } from '../../helpers/http-mocks.js';

describe('middlewares/validate', () => {
  const schemas = {
    params: z.object({ id: z.uuid() }),
    query: z.object({ page: z.coerce.number().int().min(1).default(1) }),
    body: z.object({ title: z.string().trim().min(1, 'Title is required') }),
  };

  it('replaces raw input with parsed values and calls next() without an error', () => {
    const req = createMockRequest({
      params: { id: '7f1c2b0a-1d2e-4c3b-9a8f-0e1d2c3b4a59' },
      query: { page: '3' },
      body: { title: '  Shopping list  ' },
    });
    const next = createNext();

    validate(schemas)(req, createMockResponse().res, next);

    expect(next.calledOnceWithExactly()).to.equal(true);
    expect(req.query).to.deep.equal({ page: 3 });
    expect(req.body).to.deep.equal({ title: 'Shopping list' });
  });

  it('collects errors from every part of the request into one ValidationError', () => {
    const req = createMockRequest({
      params: { id: 'not-a-uuid' },
      query: { page: '0' },
      body: { title: '   ' },
    });
    const next = createNext();

    validate(schemas)(req, createMockResponse().res, next);

    const error: unknown = next.firstCall.args[0];
    expect(error).to.be.instanceOf(ValidationError);
    const fields = (error as ValidationError).details.map((detail) => detail.field);
    expect(fields).to.deep.equal(['id', 'page', 'title']);
    expect((error as ValidationError).details[2]?.message).to.equal('Title is required');
  });

  it('works when req.query is an inherited getter-only property (Express 5)', () => {
    const prototype = {};
    Object.defineProperty(prototype, 'query', {
      get: () => ({ page: '4' }),
      configurable: true,
      enumerable: true,
    });
    const req = Object.assign(Object.create(prototype) as Request, {
      params: {},
      body: {},
    });
    const next = createNext();

    validate({ query: schemas.query })(req, createMockResponse().res, next);

    expect(next.calledOnceWithExactly()).to.equal(true);
    expect(req.query).to.deep.equal({ page: 4 });
    expect(Object.getOwnPropertyDescriptor(req, 'query')?.writable).to.equal(true);
  });

  it('skips parts that have no schema', () => {
    const req = createMockRequest({ body: { anything: true } });
    const next = createNext();

    validate({})(req, createMockResponse().res, next);

    expect(next.calledOnceWithExactly()).to.equal(true);
    expect(req.body).to.deep.equal({ anything: true });
  });

  it('reports root-level errors without a field name', () => {
    const req = createMockRequest({ body: 'plain string' });
    const next = createNext();

    validate({ body: z.object({ title: z.string() }) })(req, createMockResponse().res, next);

    const error = next.firstCall.args[0] as ValidationError;
    expect(error.details[0]?.field).to.equal(undefined);
  });
});

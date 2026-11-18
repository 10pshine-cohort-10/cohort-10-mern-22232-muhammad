import { expect } from 'chai';
import { notFound } from '../../../src/middlewares/not-found.js';
import { NotFoundError } from '../../../src/utils/errors.js';
import { createMockRequest, createMockResponse, createNext } from '../../helpers/http-mocks.js';

describe('middlewares/not-found', () => {
  it('forwards a ROUTE_NOT_FOUND error naming the method and path', () => {
    const req = createMockRequest({ method: 'DELETE', originalUrl: '/api/v1/unknown' });
    const next = createNext();

    notFound(req, createMockResponse().res, next);

    const error = next.firstCall.args[0] as NotFoundError;
    expect(error).to.be.instanceOf(NotFoundError);
    expect(error.code).to.equal('ROUTE_NOT_FOUND');
    expect(error.message).to.equal('Route DELETE /api/v1/unknown not found');
  });
});

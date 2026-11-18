import { expect } from 'chai';
import { getHealthStatus, healthCheck } from '../../../src/modules/health/health.controller.js';
import { createMockRequest, createMockResponse } from '../../helpers/http-mocks.js';

describe('modules/health › controller', () => {
  it('getHealthStatus reports ok, environment, uptime and timestamp', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const status = getHealthStatus(now);

    expect(status.status).to.equal('ok');
    expect(status.environment).to.equal('test');
    expect(status.uptimeSeconds).to.be.a('number').and.at.least(0);
    expect(status.timestamp).to.equal('2026-01-01T00:00:00.000Z');
  });

  it('healthCheck responds 200 with the success envelope', () => {
    const { res, status, json } = createMockResponse();

    healthCheck(createMockRequest(), res);

    expect(status.calledOnceWithExactly(200)).to.equal(true);
    const body = json.firstCall.args[0] as { success: boolean; data: { status: string } };
    expect(body.success).to.equal(true);
    expect(body.data.status).to.equal('ok');
  });
});

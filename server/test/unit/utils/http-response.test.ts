import { expect } from 'chai';
import { sendSuccess } from '../../../src/utils/http-response.js';
import { createMockResponse } from '../../helpers/http-mocks.js';

describe('utils/http-response › sendSuccess', () => {
  it('sends data with status 200 by default', () => {
    const { res, status, json } = createMockResponse();

    sendSuccess(res, { id: 1 });

    expect(status.calledOnceWithExactly(200)).to.equal(true);
    expect(json.firstCall.args[0]).to.deep.equal({ success: true, data: { id: 1 } });
  });

  it('supports a custom status and pagination meta', () => {
    const { res, status, json } = createMockResponse();
    const meta = { page: 2, limit: 10, total: 35 };

    sendSuccess(res, [], 201, meta);

    expect(status.calledOnceWithExactly(201)).to.equal(true);
    expect(json.firstCall.args[0]).to.deep.equal({ success: true, data: [], meta });
  });
});

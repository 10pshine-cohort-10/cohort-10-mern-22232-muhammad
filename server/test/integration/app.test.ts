import { expect } from 'chai';
import type { Express } from 'express';
import request from 'supertest';
import { API_PREFIX, createApp } from '../../src/app.js';

describe('integration › app', () => {
  let app: Express;

  before(() => {
    app = createApp();
  });

  it('GET /api/v1/health returns 200 with status ok', async () => {
    const response = await request(app).get(`${API_PREFIX}/health`).expect(200);

    expect(response.body.success).to.equal(true);
    expect(response.body.data.status).to.equal('ok');
  });

  it('attaches a request id header to every response', async () => {
    const response = await request(app).get(`${API_PREFIX}/health`);
    expect(response.headers['x-request-id']).to.be.a('string').and.not.be.empty;
  });

  it('propagates a client-supplied request id', async () => {
    const response = await request(app)
      .get(`${API_PREFIX}/health`)
      .set('x-request-id', 'client-trace-42');
    expect(response.headers['x-request-id']).to.equal('client-trace-42');
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(app).get(`${API_PREFIX}/does-not-exist`).expect(404);

    expect(response.body).to.deep.include({ success: false });
    expect(response.body.error.code).to.equal('ROUTE_NOT_FOUND');
    expect(response.body.error.requestId).to.equal(response.headers['x-request-id']);
  });

  it('returns 400 INVALID_JSON for a malformed body', async () => {
    const response = await request(app)
      .post(`${API_PREFIX}/health`)
      .set('Content-Type', 'application/json')
      .send('{"broken": ')
      .expect(400);

    expect(response.body.error.code).to.equal('INVALID_JSON');
  });

  it('sets security headers and hides the framework', async () => {
    const response = await request(app).get(`${API_PREFIX}/health`);

    expect(response.headers).to.not.have.property('x-powered-by');
    expect(response.headers['x-content-type-options']).to.equal('nosniff');
  });

  it('allows the configured frontend origin via CORS', async () => {
    const response = await request(app)
      .get(`${API_PREFIX}/health`)
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).to.equal('http://localhost:5173');
    expect(response.headers['access-control-allow-credentials']).to.equal('true');
  });

  it('does not allow unknown origins', async () => {
    const response = await request(app)
      .get(`${API_PREFIX}/health`)
      .set('Origin', 'https://evil.example');

    expect(response.headers).to.not.have.property('access-control-allow-origin');
  });
});

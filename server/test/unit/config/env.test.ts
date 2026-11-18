import { expect } from 'chai';
import { parseEnv } from '../../../src/config/env.js';

describe('config/env › parseEnv', () => {
  it('applies defaults when variables are missing', () => {
    const env = parseEnv({});

    expect(env.NODE_ENV).to.equal('development');
    expect(env.PORT).to.equal(5000);
    expect(env.CLIENT_URL).to.deep.equal(['http://localhost:5173']);
    expect(env.LOG_LEVEL).to.equal('info');
    expect(env.LOG_DIR).to.equal('logs');
  });

  it('coerces PORT and splits comma-separated CLIENT_URL values', () => {
    const env = parseEnv({
      PORT: '8080',
      CLIENT_URL: 'http://localhost:5173, https://noteflow.app',
    });

    expect(env.PORT).to.equal(8080);
    expect(env.CLIENT_URL).to.deep.equal(['http://localhost:5173', 'https://noteflow.app']);
  });

  it('throws a readable error listing every invalid variable', () => {
    expect(() => parseEnv({ NODE_ENV: 'staging', PORT: 'abc', CLIENT_URL: 'not-a-url' })).to.throw(
      /Invalid environment configuration[\s\S]*NODE_ENV[\s\S]*PORT[\s\S]*CLIENT_URL/,
    );
  });

  it('rejects an unknown LOG_LEVEL', () => {
    expect(() => parseEnv({ LOG_LEVEL: 'verbose' })).to.throw(/LOG_LEVEL/);
  });
});

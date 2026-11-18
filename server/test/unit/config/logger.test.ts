import path from 'node:path';
import { expect } from 'chai';
import { buildTransport, logger, REDACTED_PATHS } from '../../../src/config/logger.js';

describe('config/logger', () => {
  const base = { isTest: false, isProduction: false, level: 'info', logDir: 'logs' };

  it('is silent while testing', () => {
    expect(logger.level).to.equal('silent');
    expect(buildTransport({ ...base, isTest: true })).to.equal(undefined);
  });

  it('uses pretty output in development', () => {
    const transport = buildTransport(base) as { target: string };
    expect(transport.target).to.equal('pino-pretty');
  });

  it('writes to stdout and daily rotated files in production', () => {
    const transport = buildTransport({ ...base, isProduction: true, level: 'warn' }) as {
      targets: Array<{ target: string; level: string; options: Record<string, unknown> }>;
    };

    expect(transport.targets.map((target) => target.target)).to.deep.equal([
      'pino/file',
      'pino-roll',
    ]);
    expect(transport.targets.every((target) => target.level === 'warn')).to.equal(true);
    expect(transport.targets[1]?.options.file).to.equal(path.join('logs', 'app'));
    expect(transport.targets[1]?.options.frequency).to.equal('daily');
  });

  it('redacts credentials and tokens', () => {
    expect(REDACTED_PATHS).to.include.members([
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.refreshToken',
    ]);
  });
});

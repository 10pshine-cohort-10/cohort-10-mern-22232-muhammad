import path from 'node:path';
import { Writable } from 'node:stream';
import { expect } from 'chai';
import pino from 'pino';
import {
  buildLoggerOptions,
  buildTransport,
  logger,
  REDACTED_PATHS,
  REDACTION_CENSOR,
} from '../../../src/config/logger.js';

/** Creates a logger with the production options that writes JSON lines into memory. */
function createCapturingLogger() {
  const lines: string[] = [];
  const sink = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      lines.push(chunk.toString());
      callback();
    },
  });
  const captured = pino(buildLoggerOptions('info'), sink);
  const records = () => lines.map((line) => JSON.parse(line) as Record<string, unknown>);
  return { captured, lines, records };
}

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
    expect(transport.targets[1]?.options.limit).to.deep.equal({
      count: 14,
      removeOtherLogFiles: true,
    });
  });

  it('configures redaction for credentials and tokens', () => {
    expect(REDACTED_PATHS).to.include.members([
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.refreshToken',
    ]);
    expect(buildLoggerOptions('info').redact).to.deep.equal({
      paths: REDACTED_PATHS,
      censor: REDACTION_CENSOR,
    });
  });

  it('removes secrets from emitted log records but keeps other fields', () => {
    const { captured, lines, records } = createCapturingLogger();

    captured.info(
      {
        req: { headers: { authorization: 'Bearer secret-access', cookie: 'rt=secret-cookie' } },
        body: { email: 'user@example.com', password: 'hunter2', refreshToken: 'secret-refresh' },
        event: 'USER_LOGIN',
      },
      'login attempt',
    );

    const output = lines.join('');
    for (const secret of ['secret-access', 'secret-cookie', 'hunter2', 'secret-refresh']) {
      expect(output).to.not.include(secret);
    }

    const [record] = records();
    expect(record).to.deep.include({ event: 'USER_LOGIN', msg: 'login attempt' });
    expect(record?.service).to.equal('noteflow-api');
    expect(record?.body).to.deep.equal({
      email: 'user@example.com',
      password: REDACTION_CENSOR,
      refreshToken: REDACTION_CENSOR,
    });
    expect(record?.req).to.deep.equal({
      headers: { authorization: REDACTION_CENSOR, cookie: REDACTION_CENSOR },
    });
  });
});

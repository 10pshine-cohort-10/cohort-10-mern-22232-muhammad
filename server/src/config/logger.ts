import path from 'node:path';
import pino, { type LoggerOptions, type TransportTargetOptions } from 'pino';
import { env, isProduction, isTest } from './env.js';

/** Paths whose values must never appear in logs. */
export const REDACTED_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  '*.password',
  '*.currentPassword',
  '*.newPassword',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
];

function buildTransport(): LoggerOptions['transport'] {
  if (isTest) return undefined;

  if (isProduction) {
    const targets: TransportTargetOptions[] = [
      { target: 'pino/file', level: env.LOG_LEVEL, options: { destination: 1 } },
      {
        target: 'pino-roll',
        level: env.LOG_LEVEL,
        options: {
          file: path.join(env.LOG_DIR, 'app'),
          frequency: 'daily',
          extension: '.log',
          mkdir: true,
          limit: { count: 14 },
        },
      },
    ];
    return { targets };
  }

  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss.l',
      ignore: 'pid,hostname',
      singleLine: false,
    },
  };
}

const transport = buildTransport();

export const logger = pino({
  level: isTest ? 'silent' : env.LOG_LEVEL,
  base: { service: 'noteflow-api' },
  redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(transport ? { transport } : {}),
});

export type Logger = typeof logger;

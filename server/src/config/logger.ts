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

interface TransportConfig {
  isTest: boolean;
  isProduction: boolean;
  level: string;
  logDir: string;
}

/**
 * Chooses where logs go:
 * - test: nowhere (silent, no worker threads)
 * - production: JSON to stdout + daily-rotated files (14 days kept)
 * - development: colourised, human-readable output
 */
export function buildTransport(config: TransportConfig): LoggerOptions['transport'] {
  if (config.isTest) return undefined;

  if (config.isProduction) {
    const targets: TransportTargetOptions[] = [
      { target: 'pino/file', level: config.level, options: { destination: 1 } },
      {
        target: 'pino-roll',
        level: config.level,
        options: {
          file: path.join(config.logDir, 'app'),
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

const transport = buildTransport({
  isTest,
  isProduction,
  level: env.LOG_LEVEL,
  logDir: env.LOG_DIR,
});

export const logger = pino({
  level: isTest ? 'silent' : env.LOG_LEVEL,
  base: { service: 'noteflow-api' },
  redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(transport ? { transport } : {}),
});

export type Logger = typeof logger;

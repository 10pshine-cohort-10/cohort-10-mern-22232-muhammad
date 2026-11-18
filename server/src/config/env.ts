import 'dotenv/config';
import { z } from 'zod';

const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_URL: z
    .string()
    .default('http://localhost:5173')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.url()).min(1)),
  LOG_LEVEL: z.enum(logLevels).default('info'),
  LOG_DIR: z.string().min(1).default('logs'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates raw environment variables and returns a typed config object.
 * Throws a readable error listing every invalid variable so misconfiguration fails fast at startup.
 */
export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return result.data;
}

export const env: Env = parseEnv(process.env);

export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

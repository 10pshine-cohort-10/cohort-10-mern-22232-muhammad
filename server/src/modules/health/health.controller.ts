import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { sendSuccess } from '../../utils/http-response.js';

export interface HealthStatus {
  status: 'ok';
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
}

export function getHealthStatus(now: Date = new Date()): HealthStatus {
  return {
    status: 'ok',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: now.toISOString(),
  };
}

/** GET /api/v1/health — liveness probe used by monitoring and CI smoke tests. */
export function healthCheck(_req: Request, res: Response): void {
  sendSuccess(res, getHealthStatus());
}

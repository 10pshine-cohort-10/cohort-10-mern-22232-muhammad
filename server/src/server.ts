import { createServer } from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const app = createApp();
const server = createServer(app);
let shuttingDown = false;
// The exit status is shared so a fatal error during an in-progress graceful shutdown
// still makes the process exit with a failure code (never downgraded back to 0).
let exitStatus = 0;

function shutdown(reason: string, exitCode: number): void {
  exitStatus = Math.max(exitStatus, exitCode);
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ event: 'SERVER_SHUTDOWN', reason }, 'Shutting down gracefully');

  const forceExit = setTimeout(() => {
    logger.error({ event: 'SERVER_SHUTDOWN_TIMEOUT' }, 'Forced shutdown after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  server.close((closeError) => {
    if (closeError) {
      logger.error({ err: closeError }, 'Error while closing HTTP server');
    }
    logger.info({ event: 'SERVER_STOPPED' }, 'Server stopped');
    process.exit(closeError ? 1 : exitStatus);
  });
}

process.on('SIGINT', () => shutdown('SIGINT', 0));
process.on('SIGTERM', () => shutdown('SIGTERM', 0));

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason, event: 'UNHANDLED_REJECTION' }, 'Unhandled promise rejection');
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error, event: 'UNCAUGHT_EXCEPTION' }, 'Uncaught exception');
  shutdown('uncaughtException', 1);
});

server.listen(env.PORT, () => {
  logger.info(
    { event: 'SERVER_STARTED', port: env.PORT, environment: env.NODE_ENV },
    `NoteFlow API listening on http://localhost:${env.PORT}`,
  );
});

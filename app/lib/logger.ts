// lib/logger.ts
// A basic console logger. In a production environment, this should be replaced
// with a more robust, structured logging solution (e.g., Winston, Pino, Sentry).

const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
};

export default logger;

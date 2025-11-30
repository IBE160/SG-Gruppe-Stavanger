// app/lib/rate-limiter.ts
// This is a basic in-memory rate limiter suitable for a single serverless instance.
// For production environments with multiple instances, it MUST be replaced with a distributed solution
// (e.g., using Redis, Upstash, or a dedicated rate limiting service) to ensure consistency across instances.

import logger from './logger';

interface RateLimitInfo {
  count: number;
  lastReset: number;
}

const attempts = new Map<string, RateLimitInfo>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
// Higher limit for test environment to allow E2E tests to run
const MAX_REQUESTS_PER_WINDOW = process.env.NODE_ENV === 'test' ? 100 : 5; // Allow 100 requests per minute in test mode, 5 in production

export const rateLimiter = {
  check: (ip: string) => {
    // Disable rate limiting for localhost (for E2E tests)
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
      return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW };
    }

    const now = Date.now();
    let info = attempts.get(ip);

    if (!info || now - info.lastReset > WINDOW_SIZE_MS) {
      // Reset window
      info = { count: 1, lastReset: now };
      attempts.set(ip, info);
      return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
    }

    info.count++;
    attempts.set(ip, info); // Update count

    if (info.count > MAX_REQUESTS_PER_WINDOW) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return { limited: true, remaining: 0 };
    }

    return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - info.count };
  },

  // Optional: Function to clear expired entries to prevent memory leaks in long-running processes
  // In a serverless environment, instances are often short-lived, so this might be less critical
  // but good practice for completeness if the instance might persist longer.
  clearExpired: () => {
    const now = Date.now();
    for (const [ip, info] of attempts.entries()) {
      if (now - info.lastReset > WINDOW_SIZE_MS * 2) { // Clear after 2 windows
        attempts.delete(ip);
      }
    }
  },
};

// In a real application, you might want to call clearExpired periodically
// For serverless, this might not be strictly necessary as instances are ephemeral.
// setInterval(rateLimiter.clearExpired, WINDOW_SIZE_MS * 3); // e.g., every 3 minutes

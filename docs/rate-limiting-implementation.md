# Rate Limiting Implementation

## Overview

This document describes the rate limiting solution implemented for the Smart Food & Recipe Platform authentication endpoints. The solution protects both user registration and login endpoints from brute-force attacks and abuse.

## Current Implementation (Phase 1)

### Architecture

The current implementation uses an **in-memory rate limiter** suitable for single-instance serverless deployments. The rate limiter tracks request counts per IP address within a sliding time window.

**File:** `app/lib/rate-limiter.ts`

### Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| Window Size | 60 seconds (1 minute) | Time window for tracking requests |
| Max Requests | 5 | Maximum requests allowed per IP per window |
| Storage | In-memory Map | Temporary storage for request tracking |

### How It Works

1. **Request Tracking:** Each incoming request is identified by the client's IP address
2. **Window Management:** The rate limiter maintains a sliding window of 1 minute
3. **Counter Increment:** Each request increments the counter for that IP
4. **Limit Enforcement:** If the counter exceeds 5 requests within the window, subsequent requests are blocked
5. **Window Reset:** After the time window expires, the counter resets automatically

### Implementation Details

```typescript
// Basic structure of the rate limiter
interface RateLimitInfo {
  count: number;      // Number of requests in current window
  lastReset: number;  // Timestamp of window start
}

const attempts = new Map<string, RateLimitInfo>();
const WINDOW_SIZE_MS = 60 * 1000;  // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
```

### Protected Endpoints

#### 1. User Registration
- **Endpoint:** `POST /api/auth/register`
- **Location:** `app/api/auth/register/route.ts`
- **Rate Limit Applied:** IP-based, 5 requests per minute

#### 2. User Login
- **Endpoint:** `POST /api/auth/[...nextauth]` (via NextAuth.js CredentialsProvider)
- **Location:** `app/api/auth/[...nextauth]/route.ts`
- **Rate Limit Applied:** IP-based, 5 requests per minute

### IP Address Extraction

The rate limiter extracts the client IP address from request headers:

```typescript
const forwardedFor = req?.headers?.['x-forwarded-for'];
const ip = typeof forwardedFor === 'string'
  ? forwardedFor.split(',')[0].trim()
  : req?.headers?.['x-real-ip'] || '127.0.0.1';
```

This approach handles:
- Direct connections (using actual IP)
- Proxied connections (using X-Forwarded-For header)
- Load-balanced connections (using X-Real-IP header)

### Error Handling

When rate limit is exceeded:
- **HTTP Status Code:** 429 (Too Many Requests)
- **Error Message:** "Too many requests. Please try again later." (registration) or "Too many login attempts. Please try again later." (login)
- **Logging:** Warning logged with IP address

### Limitations of Current Implementation

⚠️ **Important Limitations:**

1. **Single-Instance Only:** The in-memory storage only works within a single serverless instance. Multiple instances will not share rate limit data.

2. **Memory Leaks:** In long-running processes, the Map can grow indefinitely without cleanup. A `clearExpired()` function is provided but not automatically invoked.

3. **No Persistence:** Rate limit data is lost when the instance restarts or scales down.

4. **IP-Based Only:** Can be bypassed using VPNs or proxy services.

5. **Not Distributed:** Cannot coordinate across multiple servers or serverless functions.

## Future Enhancements (Phase 2)

### Recommended Solution: Distributed Rate Limiting

For production deployment with multiple instances, a **distributed rate limiting solution** must be implemented. Recommended options:

#### Option 1: Redis-based Rate Limiting (Recommended)

**Advantages:**
- Fast and efficient
- Naturally distributed across instances
- Built-in TTL (Time To Live) for automatic cleanup
- Widely adopted and battle-tested

**Implementation with Upstash Redis:**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

// Usage
const { success, limit, remaining } = await ratelimit.limit(ip);
if (!success) {
  throw new Error("Too many requests");
}
```

**Required Dependencies:**
```json
{
  "@upstash/ratelimit": "^1.0.0",
  "@upstash/redis": "^1.28.0"
}
```

#### Option 2: Vercel Edge Config

**Advantages:**
- Native Vercel integration
- No additional infrastructure required
- Low latency reads

**Limitations:**
- Primarily designed for configuration, not high-frequency writes
- May have write throughput limitations

#### Option 3: Database-based Rate Limiting

**Advantages:**
- Uses existing database infrastructure
- Persistent storage
- Queryable for analytics

**Limitations:**
- Higher latency than in-memory or Redis
- Increased database load
- Requires careful index optimization

### Additional Security Enhancements

1. **Account-based Rate Limiting:**
   - Limit failed login attempts per email/account
   - Implement temporary account lockouts

2. **Progressive Delays:**
   - Increase delay after each failed attempt
   - Implement exponential backoff

3. **CAPTCHA Integration:**
   - Trigger CAPTCHA after multiple failed attempts
   - Use services like reCAPTCHA or hCaptcha

4. **Geolocation-based Protection:**
   - Analyze and flag suspicious login locations
   - Implement multi-factor authentication for risky logins

5. **Monitoring and Alerting:**
   - Track rate limit violations
   - Alert on potential attack patterns
   - Dashboard for security metrics

## Testing

Comprehensive tests have been implemented to verify rate limiting functionality:

### Unit Tests
- Rate limiter logic verification
- Window reset functionality
- Counter increment accuracy

### Integration Tests
- **File:** `app/api/auth/[...nextauth]/route.integration.test.ts`
- Tests for successful requests within limits
- Tests for blocking after exceeding limits
- Tests for independent IP tracking

### End-to-End Tests
- **File:** `app/e2e/login.spec.ts`
- Simulates multiple rapid login attempts
- Verifies rate limit error messages
- Tests user experience during rate limiting

## Monitoring and Maintenance

### Current Logging

The rate limiter logs the following events:
- **Rate Limit Exceeded:** Warning level with IP address
- **Failed Login Attempts:** Warning level with email and IP

**Log Location:** Configured via `app/lib/logger.ts`

### Recommended Monitoring

For production deployment:
1. **Metrics to Track:**
   - Rate limit violations per minute
   - Top offending IP addresses
   - Failed authentication attempts per endpoint

2. **Alerting Thresholds:**
   - Alert when rate limit violations exceed 100/hour
   - Alert on sustained attack patterns (>10 violations from same IP)

3. **Dashboard Metrics:**
   - Total requests vs. rate-limited requests
   - Geographic distribution of rate-limited IPs
   - Time-series graph of authentication attempts

## Migration Plan to Distributed Solution

When ready to implement distributed rate limiting:

1. **Phase 1: Setup Redis Infrastructure**
   - Create Upstash Redis instance (free tier available)
   - Configure environment variables
   - Test Redis connectivity

2. **Phase 2: Implement New Rate Limiter**
   - Create new `app/lib/distributed-rate-limiter.ts`
   - Implement Redis-based rate limiting
   - Maintain backward compatibility with existing interface

3. **Phase 3: Gradual Rollout**
   - Test in staging environment
   - Enable feature flag for gradual rollout
   - Monitor performance and error rates

4. **Phase 4: Full Migration**
   - Switch all endpoints to new rate limiter
   - Remove old in-memory implementation
   - Update documentation

5. **Phase 5: Optimization**
   - Fine-tune rate limit thresholds based on metrics
   - Implement additional security enhancements
   - Add analytics and reporting

## Configuration Reference

### Environment Variables (Future)

```env
# Rate Limiting Configuration
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_MAX_REQUESTS=5

# Redis Configuration (when implemented)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Rate Limiting Strategy
RATE_LIMIT_STRATEGY=redis  # Options: memory, redis, database
```

## References

- [OWASP Rate Limiting Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [NextAuth.js Security Best Practices](https://next-auth.js.org/configuration/options#security)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-11-29 | Initial implementation with in-memory rate limiter | Development Team |
| 2025-11-29 | Documentation created | Development Team |

---

**Last Updated:** November 29, 2025
**Status:** ✅ Implemented (Phase 1) | ⏳ Planned (Phase 2 - Distributed)

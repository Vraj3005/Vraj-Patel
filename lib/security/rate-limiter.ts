import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// local in-memory fallback for development and testing
export const ipCache = new Map<string, { count: number; resetTime: number }>();
const MAX_CACHE_SIZE = 5000;

export function cleanupStaleEntries(): void {
  const now = Date.now();
  for (const [key, record] of ipCache.entries()) {
    if (now > record.resetTime) {
      ipCache.delete(key);
    }
  }
}

function localRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (ipCache.size >= MAX_CACHE_SIZE) {
    cleanupStaleEntries();
    if (ipCache.size >= MAX_CACHE_SIZE) {
      const sorted = Array.from(ipCache.entries())
        .sort((a, b) => a[1].resetTime - b[1].resetTime);
      const toRemove = ipCache.size - Math.floor(MAX_CACHE_SIZE * 0.8);
      for (let i = 0; i < toRemove; i++) {
        if (sorted[i]) {
          ipCache.delete(sorted[i][0]);
        }
      }
    }
  }

  const record = ipCache.get(key);
  if (!record) {
    ipCache.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  if (now > record.resetTime) {
    ipCache.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > limit;
}

const isRedisConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

let redisClient: Redis | null = null;
const limiters: Record<string, Ratelimit> = {};

if (isRedisConfigured) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    limiters['contact'] = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(3, '5 m'),
      analytics: true,
      prefix: 'ratelimit:contact',
    });

    limiters['ai'] = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ai',
    });

    limiters['admin'] = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: true,
      prefix: 'ratelimit:admin',
    });

    limiters['telemetry'] = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'ratelimit:telemetry',
    });
  } catch (err) {
    console.error('Failed to initialize Upstash Redis Rate Limiter:', err);
  }
}

export async function isRateLimited(
  ip: string,
  type: 'contact' | 'ai' | 'admin' | 'telemetry' = 'contact',
  limitFallback?: number,
  windowMsFallback?: number
): Promise<boolean> {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isRedisConfigured || !redisClient) {
    if (isProd) {
      console.error('Rate Limiter Error: Upstash Redis is not configured in production. Request blocked (fail-closed).');
      return true; // Fail closed in production
    } else {
      console.warn(`[Rate Limiter Warning]: Upstash Redis is missing. Falling back to local in-memory rate limiter for key: ${type}:${ip}`);
      let limit = limitFallback;
      let windowMs = windowMsFallback;
      if (limit === undefined || windowMs === undefined) {
        if (type === 'contact') {
          limit = 3;
          windowMs = 5 * 60 * 1000;
        } else if (type === 'ai') {
          limit = 10;
          windowMs = 60 * 1000;
        } else if (type === 'admin') {
          limit = 5;
          windowMs = 10 * 60 * 1000;
        } else if (type === 'telemetry') {
          limit = 30;
          windowMs = 60 * 1000;
        } else {
          limit = 5;
          windowMs = 60 * 1000;
        }
      }
      return localRateLimit(`${type}:${ip}`, limit, windowMs);
    }
  }

  try {
    const limiter = limiters[type];
    if (!limiter) {
      console.error(`Unknown rate limit type requested: ${type}. Failing closed.`);
      return true;
    }
    const result = await limiter.limit(ip);
    return !result.success;
  } catch (err) {
    console.error('Upstash Rate Limiter invocation failed:', err);
    if (isProd) {
      return true; // Fail closed in production
    }
    return localRateLimit(`${type}:${ip}`, limitFallback || 5, windowMsFallback || 60 * 1000);
  }
}

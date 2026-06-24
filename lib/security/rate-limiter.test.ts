import { describe, it, expect } from 'vitest';
import { isRateLimited, ipCache, cleanupStaleEntries } from './rate-limiter';

describe('rate-limiter cache check', () => {
  it('should not throttle requests below limit thresholds', () => {
    const ip = '192.168.1.1';
    ipCache.clear();
    // First request should pass
    expect(isRateLimited(ip, 3, 1000)).toBe(false);
    // Second request should pass
    expect(isRateLimited(ip, 3, 1000)).toBe(false);
    // Third request should pass
    expect(isRateLimited(ip, 3, 1000)).toBe(false);
    // Fourth request should be throttled (above limit 3)
    expect(isRateLimited(ip, 3, 1000)).toBe(true);
  });

  it('should treat different IPs independently', () => {
    const ipA = '10.0.0.1';
    const ipB = '10.0.0.2';
    ipCache.clear();
    
    // ipA requests
    expect(isRateLimited(ipA, 1, 1000)).toBe(false);
    expect(isRateLimited(ipA, 1, 1000)).toBe(true);

    // ipB requests (should still be allowed)
    expect(isRateLimited(ipB, 1, 1000)).toBe(false);
    expect(isRateLimited(ipB, 1, 1000)).toBe(true);
  });

  it('should clean up stale entries and enforce max cache limit', () => {
    ipCache.clear();

    const now = Date.now();
    // 1. Add stale entry
    ipCache.set('1.1.1.1', { count: 5, resetTime: now - 1000 }); // expired
    ipCache.set('2.2.2.2', { count: 2, resetTime: now + 50000 }); // active

    cleanupStaleEntries();

    expect(ipCache.has('1.1.1.1')).toBe(false);
    expect(ipCache.has('2.2.2.2')).toBe(true);

    // 2. Enforce cache capacity limit
    ipCache.clear();
    for (let i = 0; i < 5100; i++) {
      ipCache.set(`10.0.0.${i}`, { count: 1, resetTime: now + 60000 + i });
    }

    // Call isRateLimited which triggers cleanup & limit enforcement
    isRateLimited('200.200.200.200', 5, 60000);
    
    // Total size should be constrained within MAX_CACHE_SIZE (5000)
    expect(ipCache.size).toBeLessThanOrEqual(5000);
  });
});

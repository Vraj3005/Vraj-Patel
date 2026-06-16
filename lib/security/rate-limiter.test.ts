import { describe, it, expect } from 'vitest';
import { isRateLimited } from './rate-limiter';

describe('rate-limiter cache check', () => {
  it('should not throttle requests below limit thresholds', () => {
    const ip = '192.168.1.1';
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
    
    // ipA requests
    expect(isRateLimited(ipA, 1, 1000)).toBe(false);
    expect(isRateLimited(ipA, 1, 1000)).toBe(true);

    // ipB requests (should still be allowed)
    expect(isRateLimited(ipB, 1, 1000)).toBe(false);
    expect(isRateLimited(ipB, 1, 1000)).toBe(true);
  });
});

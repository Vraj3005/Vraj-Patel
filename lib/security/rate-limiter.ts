export const ipCache = new Map<string, { count: number; resetTime: number }>();
const MAX_CACHE_SIZE = 5000;

/**
 * Cleans up expired IP cache records.
 */
export function cleanupStaleEntries(): void {
  const now = Date.now();
  for (const [ip, record] of ipCache.entries()) {
    if (now > record.resetTime) {
      ipCache.delete(ip);
    }
  }
}

/**
 * Checks if a specific IP address has exceeded the rate limit.
 * Defaults to 5 requests per minute.
 */
export function isRateLimited(
  ip: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): boolean {
  const now = Date.now();

  // 1. Manage cache size and memory leaks under load
  if (ipCache.size >= MAX_CACHE_SIZE) {
    cleanupStaleEntries();

    if (ipCache.size >= MAX_CACHE_SIZE) {
      // Evict oldest reset times if still exceeding capacity
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

  const record = ipCache.get(ip);

  if (!record) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > limit;
}

const ipCache = new Map<string, { count: number; resetTime: number }>();

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

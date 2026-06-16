import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate utility', () => {
  it('should format valid date string correctly', () => {
    const formatted = formatDate('2026-06-17T02:33:14+05:30');
    expect(formatted).toBe('Jun 17, 2026');
  });

  it('should handle standard date strings', () => {
    const formatted = formatDate('2025-12-25');
    expect(formatted).toBe('Dec 25, 2025');
  });
});

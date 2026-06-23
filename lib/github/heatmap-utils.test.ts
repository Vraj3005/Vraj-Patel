import { describe, it, expect } from 'vitest';
import { parseDateString, alignDataToWeeks } from './heatmap-utils';
import { HeatmapCell } from '@/types/advanced';

describe('parseDateString', () => {
  it('should parse YYYY-MM-DD correctly without time shift', () => {
    const d = parseDateString('2026-06-24');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5); // 0-indexed June
    expect(d.getDate()).toBe(24);
  });
});

describe('alignDataToWeeks', () => {
  it('should align days to starting Sunday and ending Saturday', () => {
    // Wednesday 2026-06-24 to Friday 2026-06-26
    const mockData: HeatmapCell[] = [
      { date: '2026-06-24', count: 5, level: 3 },
      { date: '2026-06-25', count: 0, level: 0 },
      { date: '2026-06-26', count: 10, level: 4 }
    ];

    const weeks = alignDataToWeeks(mockData);
    expect(weeks.length).toBe(1); // Fits within 1 week slice
    const singleWeek = weeks[0];
    expect(singleWeek.length).toBe(7); // Must pad to a full 7-day week
    
    // Sunday (index 0) must be a placeholder cell
    expect((singleWeek[0] as any).isPlaceholder).toBe(true);
    expect(singleWeek[0].date).toBe('2026-06-21'); // Sunday prior to June 24
    
    // Wednesday (index 3) must be the real first cell
    expect((singleWeek[3] as any).isPlaceholder).toBeFalsy();
    expect(singleWeek[3].date).toBe('2026-06-24');
    expect(singleWeek[3].count).toBe(5);

    // Saturday (index 6) must be a placeholder cell
    expect((singleWeek[6] as any).isPlaceholder).toBe(true);
    expect(singleWeek[6].date).toBe('2026-06-27'); // Saturday following June 26
  });

  it('should return empty list if raw data is empty', () => {
    const weeks = alignDataToWeeks([]);
    expect(weeks).toEqual([]);
  });
});

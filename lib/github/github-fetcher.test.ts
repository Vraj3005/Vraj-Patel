import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GithubFetcher } from './github-fetcher';
import { HeatmapCell } from '@/types/advanced';

// Mock Supabase
vi.mock('../supabase/admin', () => {
  return {
    isSupabaseAdminConfigured: true,
    supabaseAdmin: {
      from: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                updated_at: new Date().toISOString(),
                contribution_data: [
                  { date: '2026-06-24', count: 5, level: 3, contributionCount: 5, intensity: 3, weekday: 3, weekIndex: 0, account: 'vraj_personal' }
                ]
              },
              error: null
            })
          }))
        })),
        upsert: vi.fn().mockResolvedValue({ error: null })
      }))
    }
  };
});

vi.mock('../supabase/simple', () => {
  return {
    createSimpleSupabaseClient: vi.fn().mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
          }))
        })),
        upsert: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  };
});

vi.mock('../events/event-bus', () => {
  return {
    EventBus: {
      publish: vi.fn().mockResolvedValue({})
    }
  };
});

describe('GithubFetcher - mergeContributions', () => {
  it('should successfully merge counts and levels for matching dates', () => {
    const list1: HeatmapCell[] = [
      { date: '2026-06-24', count: 2, level: 1, contributionCount: 2, intensity: 1, weekday: 3, weekIndex: 0, account: 'Vraj3005', color: '#9be9a8' }
    ];
    const list2: HeatmapCell[] = [
      { date: '2026-06-24', count: 3, level: 2, contributionCount: 3, intensity: 2, weekday: 3, weekIndex: 0, account: '23bce377-debug', color: '#40c463' }
    ];

    const merged = (GithubFetcher as any).mergeContributions(list1, list2);

    expect(merged.length).toBe(1);
    expect(merged[0].date).toBe('2026-06-24');
    expect(merged[0].count).toBe(5); // 2 + 3
    expect(merged[0].contributionCount).toBe(5);
    expect(merged[0].level).toBe(3); // count 5 maps to level 3
    expect(merged[0].intensity).toBe(3);
    expect(merged[0].account).toBe('combined');
  });

  it('should correctly assign chronological weekIndex and weekday across Sunday boundaries', () => {
    // 2026-06-20 (Saturday, wd=6) and 2026-06-21 (Sunday, wd=0)
    const list1: HeatmapCell[] = [
      { date: '2026-06-20', count: 1, level: 1, contributionCount: 1, intensity: 1, weekday: 6, weekIndex: 0, account: 'Vraj3005', color: '#9be9a8' },
      { date: '2026-06-21', count: 2, level: 1, contributionCount: 2, intensity: 1, weekday: 0, weekIndex: 0, account: 'Vraj3005', color: '#9be9a8' }
    ];
    const list2: HeatmapCell[] = [];

    const merged = (GithubFetcher as any).mergeContributions(list1, list2);

    expect(merged.length).toBe(2);
    expect(merged[0].date).toBe('2026-06-20');
    expect(merged[0].weekday).toBe(6);
    expect(merged[0].weekIndex).toBe(0);

    expect(merged[1].date).toBe('2026-06-21');
    expect(merged[1].weekday).toBe(0);
    expect(merged[1].weekIndex).toBe(1); // Incremented due to Sunday boundary
  });
});

describe('GithubFetcher - getContributions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return cached data if fresh cached data exists', async () => {
    const res = await GithubFetcher.getContributions('personal');
    expect(res.data.length).toBe(1);
    expect(res.data[0].date).toBe('2026-06-24');
    expect(res.data[0].count).toBe(5);
    expect(res.isDemoMode).toBe(false);
  });
});

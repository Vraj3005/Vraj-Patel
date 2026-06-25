import { createSimpleSupabaseClient } from '../supabase/simple';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../supabase/admin';
import { HeatmapCell } from '@/types/advanced';
import { EventBus } from '../events/event-bus';
import { getErrorMessage } from '../utils';

/**
 * Service to fetch, compile, and cache GitHub contributions history blocks
 */
export class GithubFetcher {
  private static CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 Hours cache duration (safe interval)

  /**
   * Fetch user contributions list. Returns cached values if fresh, else fetches from GitHub API.
   * Aggregates contributions from both Vraj3005 (personal) and 23bce377-debug (academic).
   */
  public static async getContributions(mode: string = 'combined', forceRefresh: boolean = false): Promise<{ data: HeatmapCell[]; isDemoMode: boolean }> {
    const cacheKey = `vraj_${mode}`;
    const supabase = isSupabaseAdminConfigured ? supabaseAdmin : (createSimpleSupabaseClient() as any);

    let cachedData: HeatmapCell[] | null = null;
    let isCacheExpired = true;

    // 1. Query Supabase cache table
    try {
      const { data, error } = await supabase
        .from('github_contributions_cache')
        .select('updated_at, contribution_data')
        .eq('username', cacheKey)
        .maybeSingle();

      if (data && !error && data.contribution_data) {
        cachedData = data.contribution_data as HeatmapCell[];
        const cacheAge = Date.now() - new Date(data.updated_at).getTime();
        if (cacheAge < this.CACHE_TTL_MS && !forceRefresh) {
          isCacheExpired = false;
        }
      }
    } catch (cacheErr) {
      console.warn('Failed to query GitHub contributions cache:', cacheErr);
    }

    // 2. If cache is fresh, return it
    if (cachedData && !isCacheExpired) {
      return { data: cachedData, isDemoMode: false };
    }

    // 3. Cache expired or missing. Fetch live data.
    try {
      let rawData: HeatmapCell[] = [];

      if (mode === 'personal') {
        rawData = await this.fetchFromGitHub('Vraj3005');
      } else if (mode === 'academic') {
        rawData = await this.fetchFromGitHub('23bce377-debug');
      } else {
        // Combined (default)
        const [res1, res2] = await Promise.all([
          this.fetchFromGitHub('Vraj3005'),
          this.fetchFromGitHub('23bce377-debug')
        ]);

        rawData = this.mergeContributions(res1, res2);
      }

      // 4. Update the Supabase cache
      try {
        await supabase.from('github_contributions_cache').upsert({
          username: cacheKey,
          updated_at: new Date().toISOString(),
          contribution_data: rawData
        }, { onConflict: 'username' });
      } catch (upsertErr) {
        console.error('Failed to write to GitHub contributions cache database:', upsertErr);
      }

      // 5. Write a safe success event to system_events
      await EventBus.publish(
        'github_sync',
        'success',
        `GitHub contributions cache successfully synced for account context: ${
          mode === 'combined'
            ? 'Combined (Vraj3005 + 23bce377-debug)'
            : mode === 'personal'
            ? 'Vraj3005 (Personal)'
            : '23bce377-debug (Academic)'
        }`,
        { mode, recordCount: rawData.length }
      );

      return { data: rawData, isDemoMode: false };
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err);
      console.error(`GitHub contributions fetcher error for mode "${mode}":`, err);

      // 6. Write a safe error event to system_events
      await EventBus.publish(
        'github_sync',
        'error',
        `Failed to sync GitHub contributions for account context "${mode}": ${errMsg}`,
        { mode, error: errMsg }
      );

      // 7. If API fails, fall back to cached data (even if expired)
      if (cachedData) {
        console.warn(`Serving expired cache fallback for mode "${mode}" due to API sync failure.`);
        return { data: cachedData, isDemoMode: false };
      }

      // 8. If no cache exists, throw an error to signal to frontend
      throw new Error('GitHub data unavailable');
    }
  }

  /**
   * Helper to merge two contribution lists chronologically
   */
  private static mergeContributions(data1: HeatmapCell[], data2: HeatmapCell[]): HeatmapCell[] {
    const dateMap: Record<string, HeatmapCell> = {};

    data1.forEach((cell) => {
      dateMap[cell.date] = { ...cell };
    });

    data2.forEach((cell) => {
      const existing = dateMap[cell.date];
      if (existing) {
        const mergedCount = existing.count + cell.count;
        let mergedLevel: 0 | 1 | 2 | 3 | 4 = 0;
        if (mergedCount > 0 && mergedCount <= 2) mergedLevel = 1;
        else if (mergedCount > 2 && mergedCount <= 4) mergedLevel = 2;
        else if (mergedCount > 4 && mergedCount <= 6) mergedLevel = 3;
        else if (mergedCount > 6) mergedLevel = 4;

        dateMap[cell.date] = {
          date: cell.date,
          count: mergedCount,
          level: mergedLevel,
          contributionCount: mergedCount,
          intensity: mergedLevel,
          color: cell.color || existing.color || '#ebedf0',
          account: 'combined',
          weekday: cell.weekday !== undefined ? cell.weekday : existing.weekday,
          weekIndex: cell.weekIndex !== undefined ? cell.weekIndex : existing.weekIndex
        };
      } else {
        dateMap[cell.date] = {
          ...cell,
          account: 'combined'
        };
      }
    });

    const mergedList = Object.values(dateMap);
    mergedList.sort((a, b) => a.date.localeCompare(b.date));

    // Re-assign weekIndex chronologically starting from 0, incrementing on each Sunday (weekday === 0)
    let currentWeekIndex = 0;
    for (let i = 0; i < mergedList.length; i++) {
      const cell = mergedList[i];
      const dateParts = cell.date.split('-').map(Number);
      const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const wd = d.getDay();

      if (i > 0 && wd === 0) {
        currentWeekIndex++;
      }

      cell.weekday = wd;
      cell.weekIndex = currentWeekIndex;
    }

    return mergedList;
  }

  /**
   * Performs HTTP request to fetch active contributions counts list using GitHub GraphQL API
   */
  private static async fetchFromGitHub(username: string): Promise<HeatmapCell[]> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is not defined in the server environment');
    }

    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                  weekday
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Vraj-Portfolio-App'
      },
      body: JSON.stringify({
        query,
        variables: { login: username }
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API returned status ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(`GitHub GraphQL query failed: ${json.errors[0].message}`);
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      throw new Error(`Invalid response structure or user not found: ${username}`);
    }

    const cells: HeatmapCell[] = [];
    const weeks = calendar.weeks || [];

    weeks.forEach((week: any, weekIndex: number) => {
      if (week && Array.isArray(week.contributionDays)) {
        week.contributionDays.forEach((day: any) => {
          const count = day.contributionCount || 0;
          let level: 0 | 1 | 2 | 3 | 4 = 0;
          if (count > 0 && count <= 2) level = 1;
          else if (count > 2 && count <= 4) level = 2;
          else if (count > 4 && count <= 6) level = 3;
          else if (count > 6) level = 4;

          cells.push({
            date: day.date,
            count: count,
            level: level,
            contributionCount: count,
            intensity: level,
            color: day.color || '#ebedf0',
            account: username,
            weekday: typeof day.weekday === 'number' ? day.weekday : new Date(day.date).getDay(),
            weekIndex: weekIndex
          });
        });
      }
    });

    // Sort chronologically and assign normalized weekIndex to be perfectly aligned
    cells.sort((a, b) => a.date.localeCompare(b.date));
    let currentWeekIndex = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const dateParts = cell.date.split('-').map(Number);
      const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const wd = d.getDay();

      if (i > 0 && wd === 0) {
        currentWeekIndex++;
      }

      cell.weekday = wd;
      cell.weekIndex = currentWeekIndex;
    }

    return cells;
  }
}

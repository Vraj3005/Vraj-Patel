import { createSimpleSupabaseClient } from '../supabase/simple';
import { HeatmapCell } from '@/types/advanced';

/**
 * Service to fetch, compile, and cache GitHub contributions history blocks
 */
export class GithubFetcher {
  private static CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours cache duration

  /**
   * Fetch user contributions list. Returns cached values if fresh, else scrapes GitHub stats.
   * Aggregates contributions from both Vraj3005 (personal) and 23bce377-debug (academic).
   */
  public static async getContributions(mode: string = 'combined'): Promise<HeatmapCell[]> {
    const cacheKey = `vraj_${mode}`;
    const supabase = createSimpleSupabaseClient() as any;

    try {
      let rawData: HeatmapCell[] = [];

      // 1. Query Supabase cache table
      const { data, error } = await supabase
        .from('github_contributions_cache')
        .select('updated_at, contribution_data')
        .eq('username', cacheKey)
        .maybeSingle();

      if (data && !error) {
        const cacheAge = Date.now() - new Date(data.updated_at).getTime();
        if (cacheAge < this.CACHE_TTL_MS) {
          rawData = data.contribution_data as HeatmapCell[];
        }
      }

      if (rawData.length === 0) {
        if (mode === 'personal') {
          rawData = await this.fetchFromGitHub('Vraj3005');
        } else if (mode === 'academic') {
          rawData = await this.fetchFromGitHub('23bce377-debug');
        } else {
          // Combined (default)
          // 2. Fetch data for both profiles in parallel
          const [data1, data2] = await Promise.all([
            this.fetchFromGitHub('Vraj3005'),
            this.fetchFromGitHub('23bce377-debug')
          ]);

          // 3. Merge counts by date
          const dateMap: Record<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }> = {};

          data1.forEach((cell) => {
            dateMap[cell.date] = { count: cell.count, level: cell.level };
          });

          data2.forEach((cell) => {
            if (dateMap[cell.date]) {
              const newCount = dateMap[cell.date].count + cell.count;
              let newLevel: 0 | 1 | 2 | 3 | 4 = 0;
              if (newCount > 0 && newCount <= 2) newLevel = 1;
              else if (newCount > 2 && newCount <= 4) newLevel = 2;
              else if (newCount > 4 && newCount <= 6) newLevel = 3;
              else if (newCount > 6) newLevel = 4;

              dateMap[cell.date] = { count: newCount, level: newLevel };
            } else {
              dateMap[cell.date] = { count: cell.count, level: cell.level };
            }
          });

          rawData = Object.entries(dateMap)
            .map(([date, val]) => ({
              date,
              count: val.count,
              level: val.level
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
        }

        // 4. Persist combined/individual contribution array to cache table
        await supabase.from('github_contributions_cache').upsert({
          username: cacheKey,
          updated_at: new Date().toISOString(),
          contribution_data: rawData
        }, { onConflict: 'username' });
      }

      // 5. Post-process: Filter out future dates and slice to the last 371 days (53 weeks)
      // India Time is UTC+5:30
      const offset = 5.5 * 60 * 60 * 1000;
      const todayStr = new Date(Date.now() + offset).toISOString().split('T')[0];
      
      const sortedData = [...rawData].sort((a, b) => a.date.localeCompare(b.date));
      const filteredData = sortedData.filter(d => d.date <= todayStr);
      return filteredData.slice(-371);
    } catch (err) {
      console.error('GitHub contributions fetcher error, serving mock stats fallback:', err);
      return this.generateMockContributions();
    }
  }

  /**
   * Performs HTTP request to fetch active contributions counts list
   */
  private static async fetchFromGitHub(username: string): Promise<HeatmapCell[]> {
    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
        next: { revalidate: 3600 }
      });
      
      if (!response.ok) throw new Error('GitHub metrics endpoint returned error status');
      
      const json = await response.json();
      if (!json.contributions || !Array.isArray(json.contributions)) {
        throw new Error('Invalid JSON structure returned by contributions compiler');
      }

      return json.contributions.map((c: any) => ({
        date: c.date,
        count: c.count,
        level: c.level as HeatmapCell['level']
      }));
    } catch (err) {
      console.warn(`Could not fetch real GitHub data for ${username}, utilizing realistic seed data.`, err);
      return this.generateMockContributions();
    }
  }

  /**
   * Fallback generation when GitHub APIs are blocked/offline
   */
  private static generateMockContributions(): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      // Generate some realistic developer patterns (low on weekends, active on weekdays)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const count = isWeekend 
        ? (Math.random() > 0.85 ? Math.floor(Math.random() * 3) : 0)
        : Math.floor(Math.pow(Math.random(), 2) * 8);

      let level: HeatmapCell['level'] = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 4) level = 2;
      else if (count > 4 && count <= 6) level = 3;
      else if (count > 6) level = 4;

      cells.push({
        date: d.toISOString().split('T')[0],
        count,
        level
      });
    }

    return cells;
  }
}

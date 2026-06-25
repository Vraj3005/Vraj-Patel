import { supabaseAdmin, isSupabaseAdminConfigured } from '../supabase/admin';
import fs from 'fs';
import path from 'path';

class Mutex {
  private queue: Promise<void> = Promise.resolve();

  public async acquire(): Promise<() => void> {
    let release: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const current = this.queue;
    this.queue = current.then(() => pending);
    await current;
    return release!;
  }
}

const eventMutex = new Mutex();
const metricMutex = new Mutex();

/**
 * Server-only logger to handle writing telemetry events and metrics
 * directly to the database or falling back to the local JSON file database.
 * Safe to import in Server Components, API routes, and server-side services.
 */
export class ServerLogger {
  /**
   * Log an audit or operational system event
   */
  public static async logEvent(
    source: 'portfolio' | 'ask-vraj' | 'ask_vraj' | 'contact' | 'metrics' | 'github-sync' | 'github_sync' | 'cli' | 'analytics' | 'admin' | 'dashboard',
    severity: 'info' | 'success' | 'warning' | 'warn' | 'error' | 'trace',
    message: string,
    metadata: Record<string, any> = {},
    isPublic: boolean = true
  ): Promise<void> {
    try {
      let supabaseSuccess = false;

      // 1. Try to insert to Supabase system_events via service role client (admin bypasses RLS)
      if (isSupabaseAdminConfigured) {
        try {
          const { error } = await (supabaseAdmin as any).from('system_events').insert({
            event_type: source,
            severity,
            message,
            metadata,
            is_public: isPublic
          });
          if (!error) {
            supabaseSuccess = true;
          } else {
            if (error.code === 'PGRST205' || error.code === 'PGRST204' || error.code === '42703') {
              console.warn(
                `[Supabase Warning] Table or columns (e.g. 'is_public') in 'system_events' are missing from schema cache (${error.code}). ` +
                `Please execute the SQL migration scripts in 'supabase/migrations/' inside your Supabase project SQL Editor. ` +
                `Using local fallback datastore.`
              );
            } else {
              console.error('Supabase system_events insert error:', error);
            }
          }
        } catch (dbErr) {
          console.warn('Supabase system_events logging failed:', dbErr);
        }
      }

      // 2. Fallback: log to local filesystem database if Supabase fails or is unconfigured
      if (!supabaseSuccess) {
        // Prevent local JSON file fallback in production environments
        if (process.env.NODE_ENV === 'production') {
          console.warn('[Telemetry disabled in Production]: Supabase is not configured or failed to log event.');
          return;
        }

        const release = await eventMutex.acquire();
        try {
          const dbPath = path.join(process.cwd(), 'db', 'system_events.json');
          const dir = path.dirname(dbPath);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          let events = [];
          if (fs.existsSync(dbPath)) {
            const content = fs.readFileSync(dbPath, 'utf-8');
            events = JSON.parse(content || '[]');
          }

          const newEvent = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            event_type: source,
            severity,
            message,
            metadata,
            is_public: isPublic
          };

          events.push(newEvent);

          // Retention limits: keep last 200 events locally to prevent large files
          if (events.length > 200) {
            events = events.slice(-200);
          }

          fs.writeFileSync(dbPath, JSON.stringify(events, null, 2), 'utf-8');
        } catch (localErr) {
          console.error('Failed to log system event to local fallback db:', localErr);
        } finally {
          release();
        }
      }
    } catch (err) {
      console.error('Failed to log telemetry event server-side:', err);
    }
  }

  /**
   * Capture a performance or system metric snapshot (e.g. latency, CPU, count)
   */
  public static async logMetric(
    metricName: string,
    metricValue: number,
    tags: Record<string, string> = {}
  ): Promise<void> {
    try {
      let supabaseSuccess = false;

      // 1. Try to insert to Supabase metrics_snapshots via service role client (admin bypasses RLS)
      if (isSupabaseAdminConfigured) {
        try {
          const { error } = await (supabaseAdmin as any).from('metrics_snapshots').insert({
            metric_name: metricName,
            metric_value: metricValue,
            tags
          });
          if (!error) {
            supabaseSuccess = true;
          }
        } catch (_dbErr) {
          // ignore
        }
      }

      // 2. Fallback: log to local filesystem database for metrics
      if (!supabaseSuccess) {
        // Prevent local JSON file fallback in production environments
        if (process.env.NODE_ENV === 'production') {
          return;
        }

        const release = await metricMutex.acquire();
        try {
          const dbPath = path.join(process.cwd(), 'db', 'metrics_snapshots.json');
          const dir = path.dirname(dbPath);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          let metrics = [];
          if (fs.existsSync(dbPath)) {
            const content = fs.readFileSync(dbPath, 'utf-8');
            metrics = JSON.parse(content || '[]');
          }

          metrics.push({
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
            created_at: new Date().toISOString(),
            metric_name: metricName,
            metric_value: metricValue,
            tags
          });

          // Limit local metrics storage size to 500 records
          if (metrics.length > 500) {
            metrics = metrics.slice(-500);
          }

          fs.writeFileSync(dbPath, JSON.stringify(metrics, null, 2), 'utf-8');
        } catch (localErr) {
          console.error('Failed to log metric to local fallback db:', localErr);
        } finally {
          release();
        }
      }
    } catch (err) {
      console.error('Failed to capture metric snapshot server-side:', err);
    }
  }
}

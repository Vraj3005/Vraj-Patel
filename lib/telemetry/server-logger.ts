import { createSimpleSupabaseClient, isSupabaseConfigured } from '../supabase/simple';
import fs from 'fs';
import path from 'path';

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
    source: 'portfolio' | 'ask-vraj' | 'contact' | 'metrics' | 'github-sync' | 'cli' | 'analytics' | 'admin',
    severity: 'info' | 'success' | 'warning' | 'error' | 'trace',
    message: string,
    metadata: Record<string, any> = {},
    isPublic: boolean = true
  ): Promise<void> {
    try {
      let supabaseSuccess = false;

      // 1. Try to insert to Supabase system_events
      if (isSupabaseConfigured) {
        try {
          const supabase = createSimpleSupabaseClient() as any;
          const { error } = await supabase.from('system_events').insert({
            event_type: source,
            severity,
            message,
            metadata,
            is_public: isPublic
          });
          if (!error) {
            supabaseSuccess = true;
          }
        } catch (dbErr) {
          console.warn('Supabase system_events logging failed, utilizing local fallback:', dbErr);
        }
      }

      // 2. Fallback: log to local filesystem database if Supabase fails or is unconfigured
      if (!supabaseSuccess) {
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
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
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

      // 1. Try to insert to Supabase metrics_snapshots
      if (isSupabaseConfigured) {
        try {
          const supabase = createSimpleSupabaseClient() as any;
          const { error } = await supabase.from('metrics_snapshots').insert({
            metric_name: metricName,
            metric_value: metricValue,
            tags
          });
          if (!error) {
            supabaseSuccess = true;
          }
        } catch (dbErr) {
          // ignore
        }
      }

      // 2. Fallback: log to local filesystem database for metrics
      if (!supabaseSuccess) {
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
        }
      }
    } catch (err) {
      console.error('Failed to capture metric snapshot server-side:', err);
    }
  }
}

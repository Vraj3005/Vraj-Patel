/**
 * Lightweight browser/client telemetry proxy to log events.
 * Safe to import in both Client and Server Components as it contains no Node-native modules.
 */
export class TelemetryClient {
  /**
   * Log an audit or operational system event.
   * Dispatches a POST request to the server telemetry log endpoint.
   */
  public static async logEvent(
    source: 'portfolio' | 'ask-vraj' | 'ask_vraj' | 'contact' | 'metrics' | 'github-sync' | 'github_sync' | 'cli' | 'analytics' | 'admin' | 'dashboard',
    severity: 'info' | 'success' | 'warning' | 'warn' | 'error' | 'trace',
    message: string,
    metadata: Record<string, any> = {},
    isPublic: boolean = true
  ): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/telemetry/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, severity, message, metadata, isPublic }),
        }).catch((err) => {
          console.warn('[Telemetry API Dispatch Warning]:', err);
        });
      }
    } catch (err) {
      console.error('Failed to dispatch telemetry event:', err);
    }
  }

  /**
   * Capture a performance or system metric snapshot.
   * Client-side no-op (metrics are recorded on the server).
   */
  public static async logMetric(
    metricName: string,
    metricValue: number,
    tags: Record<string, string> = {}
  ): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/telemetry/metric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metricName, metricValue, tags }),
        }).catch((err) => {
          console.warn('[Telemetry Metric API Dispatch Warning]:', err);
        });
      }
    } catch (err) {
      console.error('Failed to dispatch telemetry metric event:', err);
    }
  }
}

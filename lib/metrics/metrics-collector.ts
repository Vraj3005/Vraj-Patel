import { ServerLogger } from '../telemetry/server-logger';

/**
 * Service to aggregate, process, and log timeseries metrics snapshots
 */
export class MetricsCollector {
  /**
   * Records a snapshot of Node process memory footprint metrics
   */
  public static async recordProcessMemory(): Promise<void> {
    if (typeof process === 'undefined') return;

    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100;
      const rssMB = Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100;

      await ServerLogger.logMetric('process_heap_used_mb', heapUsedMB, { type: 'memory' });
      await ServerLogger.logMetric('process_rss_mb', rssMB, { type: 'memory' });
    } catch (err) {
      console.error('Failed to log process memory snapshot:', err);
    }
  }

  /**
   * Log api latency rate point
   */
  public static async recordApiLatency(path: string, durationMs: number): Promise<void> {
    await ServerLogger.logMetric('api_latency_ms', durationMs, { path });
  }

  /**
   * Logs direct count of transaction events
   */
  public static async recordRequestCount(path: string): Promise<void> {
    await ServerLogger.logMetric('api_requests_count', 1, { path });
  }
}

import { supabaseAdmin, isSupabaseAdminConfigured } from '../supabase/admin';
import { RequestTraceRecord, RequestTraceStep } from '@/types/advanced';

/**
 * Service to record request lifecycle steps and execute database trace ingestion.
 * Capped in size and time-to-live to prevent memory leaks.
 */
export class RequestTracker {
  private static activeTraces = new Map<string, RequestTraceRecord>();
  private static readonly MAX_SIZE = 1000;
  private static readonly TTL_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Cleans up expired traces and enforces active traces limits.
   */
  private static cleanup() {
    const now = Date.now();
    
    // 1. Evict expired entries
    for (const [id, trace] of this.activeTraces.entries()) {
      const created = new Date(trace.timestamp).getTime();
      if (now - created > this.TTL_MS) {
        this.activeTraces.delete(id);
      }
    }

    // 2. Enforce absolute limit
    if (this.activeTraces.size >= this.MAX_SIZE) {
      const sorted = Array.from(this.activeTraces.entries())
        .sort((a, b) => new Date(a[1].timestamp).getTime() - new Date(b[1].timestamp).getTime());
      
      const toRemove = this.activeTraces.size - Math.floor(this.MAX_SIZE * 0.8);
      for (let i = 0; i < toRemove; i++) {
        if (sorted[i]) {
          this.activeTraces.delete(sorted[i][0]);
        }
      }
    }
  }

  /**
   * Initialize a new execution trace for an incoming request
   */
  public static startTrace(path: string, method: string): string {
    this.cleanup();

    const traceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    const newTrace: RequestTraceRecord = {
      id: traceId,
      timestamp: new Date().toISOString(),
      path,
      method,
      statusCode: 200,
      totalDurationMs: 0,
      steps: []
    };
    
    this.activeTraces.set(traceId, newTrace);
    this.addStep(traceId, 'init_request', 0, 'success', { message: 'Request trace started.' });
    return traceId;
  }

  /**
   * Add a lifecycle step to a trace (e.g. database querying, LLM response stream)
   */
  public static addStep(
    traceId: string,
    name: string,
    durationMs: number,
    status: 'success' | 'warning' | 'error' = 'success',
    metadata?: Record<string, any>
  ) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    const step: RequestTraceStep = {
      name,
      durationMs,
      status,
      timestamp: new Date().toISOString(),
      metadata
    };

    trace.steps.push(step);
    trace.totalDurationMs += durationMs;
  }

  /**
   * Terminate the trace session, finalize total latency duration, and upload trace to Supabase
   */
  public static async endTrace(traceId: string, statusCode: number, finalDurationMs?: number) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    trace.statusCode = statusCode;
    if (finalDurationMs !== undefined) {
      trace.totalDurationMs = finalDurationMs;
    }

    this.addStep(traceId, 'finalize_request', 0, 'success', { statusCode });
    this.activeTraces.delete(traceId);

    // Write trace logs asynchronously to Supabase via service role client (admin bypasses RLS)
    if (isSupabaseAdminConfigured) {
      try {
        await (supabaseAdmin as any).from('request_traces').insert({
          id: trace.id,
          created_at: trace.timestamp,
          path: trace.path,
          method: trace.method,
          status_code: trace.statusCode,
          duration_ms: trace.totalDurationMs,
          ip_hash: 'anonymous', // Anonymized for security/privacy
          steps: trace.steps
        });
      } catch (err) {
        console.error('Failed to persist telemetry request trace:', err);
      }
    }
  }

  /**
   * Managed execution wrapper to ensure traces end reliably even if errors occur
   */
  public static async runWithTrace<T>(
    path: string,
    method: string,
    action: (traceId: string) => Promise<T>
  ): Promise<T> {
    const traceId = this.startTrace(path, method);
    const start = Date.now();
    let statusCode = 200;
    try {
      return await action(traceId);
    } catch (err) {
      statusCode = 500;
      this.addStep(traceId, 'error', Date.now() - start, 'error', {
        message: err instanceof Error ? err.message : String(err)
      });
      throw err;
    } finally {
      const finalDuration = Date.now() - start;
      await this.endTrace(traceId, statusCode, finalDuration);
    }
  }
}

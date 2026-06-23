import { createSimpleSupabaseClient } from '../supabase/simple';
import { RequestTraceRecord, RequestTraceStep } from '@/types/advanced';

/**
 * Helper to record request lifecycle steps and execute database trace ingestion
 */
export class RequestTracker {
  private static activeTraces = new Map<string, RequestTraceRecord>();

  /**
   * Initialize a new execution trace for an incoming request
   */
  public static startTrace(path: string, method: string): string {
    const traceId = crypto.randomUUID();
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

    // Write trace logs asynchronously to Supabase
    try {
      const supabase = createSimpleSupabaseClient() as any;
      await supabase.from('request_traces').insert({
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

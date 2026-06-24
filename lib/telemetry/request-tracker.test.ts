import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestTracker } from './request-tracker';

// Mock Supabase Simple client helper to bypass actual database connection calls
vi.mock('../supabase/simple', () => ({
  createSimpleSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }))
}));

describe('RequestTracker', () => {
  let traceId: string;

  beforeEach(() => {
    // Start a fresh trace before each test
    traceId = RequestTracker.startTrace('/api/test-route', 'POST');
  });

  it('should initialize a trace record with uuid', () => {
    expect(traceId).toBeDefined();
    expect(typeof traceId).toBe('string');
    expect(traceId.length).toBeGreaterThan(0);
  });

  it('should append steps correctly to the active trace record', () => {
    // Add custom steps and assert step structures are logged
    RequestTracker.addStep(traceId, 'validate_jwt_cookie', 10, 'success', { role: 'user' });
    RequestTracker.addStep(traceId, 'fetch_db_users', 140, 'success');
    
    // Retrieve tracking map to verify active items
    const active = (RequestTracker as any).activeTraces.get(traceId);
    expect(active).toBeDefined();
    expect(active.path).toBe('/api/test-route');
    expect(active.method).toBe('POST');
    expect(active.steps.length).toBe(3); // init_request (added automatically) + 2 custom steps
    
    expect(active.steps[1].name).toBe('validate_jwt_cookie');
    expect(active.steps[1].durationMs).toBe(10);
    expect(active.steps[1].status).toBe('success');
    expect(active.steps[1].metadata).toEqual({ role: 'user' });
    
    expect(active.steps[2].name).toBe('fetch_db_users');
    expect(active.steps[2].durationMs).toBe(140);
  });

  it('should clean active trace from memory upon endTrace trigger', async () => {
    // End the trace execution and verify memory cleanup
    await RequestTracker.endTrace(traceId, 200, 200);
    const active = (RequestTracker as any).activeTraces.get(traceId);
    expect(active).toBeUndefined(); // Should be pruned from active map
  });

  it('should evict expired traces and enforce max limit', () => {
    // 1. Evict expired
    const activeMap = (RequestTracker as any).activeTraces;
    activeMap.clear();

    const staleTraceId = RequestTracker.startTrace('/api/stale', 'GET');
    const staleRecord = activeMap.get(staleTraceId);
    // Backdate it to 10 minutes ago
    staleRecord.timestamp = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const activeTraceId = RequestTracker.startTrace('/api/active', 'GET');

    // Trigger cleanup inside startTrace
    RequestTracker.startTrace('/api/new', 'GET');

    expect(activeMap.has(staleTraceId)).toBe(false);
    expect(activeMap.has(activeTraceId)).toBe(true);

    // 2. Enforce absolute limit
    activeMap.clear();
    // Fill to capacity (1000 limit)
    for (let i = 0; i < 1100; i++) {
      activeMap.set(`trace-${i}`, {
        id: `trace-${i}`,
        timestamp: new Date(Date.now() + i).toISOString(),
        path: '/api/fill',
        method: 'GET',
        statusCode: 200,
        totalDurationMs: 0,
        steps: []
      });
    }

    RequestTracker.startTrace('/api/over', 'GET');
    expect(activeMap.size).toBeLessThanOrEqual(1000);
  });

  it('should run runWithTrace wrapper and clean up even on failure', async () => {
    const activeMap = (RequestTracker as any).activeTraces;
    activeMap.clear();

    let didRun = false;
    const result = await RequestTracker.runWithTrace('/api/run', 'POST', async (tid) => {
      didRun = true;
      RequestTracker.addStep(tid, 'inner_action', 50);
      return 'success';
    });

    expect(result).toBe('success');
    expect(didRun).toBe(true);
    expect(activeMap.size).toBe(0); // cleaned up

    // Check error handling
    await expect(
      RequestTracker.runWithTrace('/api/run-fail', 'POST', async () => {
        throw new Error('intentional error');
      })
    ).rejects.toThrow('intentional error');

    expect(activeMap.size).toBe(0); // cleaned up
  });
});

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
});

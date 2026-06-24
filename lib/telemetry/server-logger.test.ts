import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServerLogger } from './server-logger';
import fs from 'fs';
import path from 'path';

// Mock Supabase Admin client helper
vi.mock('../supabase/admin', () => ({
  isSupabaseAdminConfigured: false,
  supabaseAdmin: {},
}));

describe('ServerLogger Event Ingestion Fallbacks & RLS Mock Checks', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.restoreAllMocks();
    (process.env as any).NODE_ENV = 'development';
  });

  it('should write events successfully to fallback file in non-production environments', async () => {
    const spyExistsSync = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const mockEvents = [
      {
        id: 'old-1',
        created_at: new Date().toISOString(),
        event_type: 'contact',
        severity: 'info',
        message: 'Older message log',
        metadata: {},
        is_public: true
      }
    ];
    const spyReadFileSync = vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockEvents));
    const spyWriteFileSync = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    await ServerLogger.logEvent('contact', 'success', 'New inquiry submitted', { val: 42 }, true);

    expect(spyReadFileSync).toHaveBeenCalled();
    expect(spyWriteFileSync).toHaveBeenCalled();

    const writeCallArg = spyWriteFileSync.mock.calls[0][1] as string;
    const parsedWritten = JSON.parse(writeCallArg);
    expect(parsedWritten.length).toBe(2);
    expect(parsedWritten[1].message).toBe('New inquiry submitted');
    expect(parsedWritten[1].event_type).toBe('contact');
    expect(parsedWritten[1].severity).toBe('success');
    expect(parsedWritten[1].metadata).toEqual({ val: 42 });
    expect(parsedWritten[1].is_public).toBe(true);

    spyExistsSync.mockRestore();
    spyReadFileSync.mockRestore();
    spyWriteFileSync.mockRestore();
  });

  it('should prevent local fallback JSON logs in production environment', async () => {
    (process.env as any).NODE_ENV = 'production';
    const spyWriteFileSync = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    await ServerLogger.logEvent('cli', 'info', 'Production CLI commands run', {}, true);

    expect(spyWriteFileSync).not.toHaveBeenCalled();
    spyWriteFileSync.mockRestore();
  });
});

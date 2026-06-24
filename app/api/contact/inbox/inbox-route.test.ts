import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

vi.mock('@/lib/supabase/admin', () => ({
  isSupabaseAdminConfigured: false,
  supabaseAdmin: {},
}));

describe('Inbox Route Secure API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  it('should return 401 Unauthorized for incorrect passcode', async () => {
    process.env.INBOX_PASSCODE = 'super-secret';
    const request = new NextRequest('http://localhost/api/contact/inbox', {
      method: 'POST',
      body: JSON.stringify({ passcode: 'wrong-passcode' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toContain('Unauthorized');
  });

  it('should return 500 configuration error if INBOX_PASSCODE is not set', async () => {
    delete process.env.INBOX_PASSCODE;
    const request = new NextRequest('http://localhost/api/contact/inbox', {
      method: 'POST',
      body: JSON.stringify({ passcode: 'any-passcode' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain('System configuration error');
  });

  it('should authenticate successfully and retrieve messages with correct passcode', async () => {
    process.env.INBOX_PASSCODE = 'super-secret';
    
    // Mock local db messages if exists, or ensure we fallback
    const spyExists = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const mockMessages = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Hello Vraj, I would like to build a web app with you.',
        status: 'new',
        createdAt: '2026-06-24T12:00:00Z',
      }
    ];
    const spyRead = vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockMessages));

    const request = new NextRequest('http://localhost/api/contact/inbox', {
      method: 'POST',
      body: JSON.stringify({ passcode: 'super-secret' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.messages.length).toBe(1);
    expect(body.messages[0].name).toBe('John Doe');

    spyExists.mockRestore();
    spyRead.mockRestore();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import fs from 'fs';

// Mock requireAdmin helper
const mockRequireAdmin = vi.fn();
vi.mock('@/lib/auth/require-admin', () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  isSupabaseAdminConfigured: false,
  supabaseAdmin: {},
}));

describe('Inbox Route Secure API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockRequireAdmin.mockReset();
  });

  it('should return 401 Unauthorized if requireAdmin returns a 401 error', async () => {
    mockRequireAdmin.mockResolvedValue({
      user: null,
      admin: null,
      error: 'Authentication required. Please sign in.',
      status: 401,
    });

    const request = new NextRequest('http://localhost/api/contact/inbox', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toContain('Authentication required');
  });

  it('should return 403 Forbidden if requireAdmin returns a 403 error', async () => {
    mockRequireAdmin.mockResolvedValue({
      user: { id: 'some-user-id' },
      admin: null,
      error: 'Access denied: User is not an authorized administrator.',
      status: 403,
    });

    const request = new NextRequest('http://localhost/api/contact/inbox', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toContain('Access denied');
  });

  it('should return 200 with messages if requireAdmin returns successfully', async () => {
    mockRequireAdmin.mockResolvedValue({
      user: { id: 'mock-admin-id', email: 'admin@example.com' },
      admin: { id: 'mock-admin-id', email: 'admin@example.com' },
    });
    
    // Mock local db messages read
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
      body: JSON.stringify({}),
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

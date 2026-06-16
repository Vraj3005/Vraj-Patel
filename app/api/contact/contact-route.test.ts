import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server', () => ({
  isSupabaseConfigured: false,
  createServerSupabaseClient: vi.fn(),
}));

describe('Contact Route API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject invalid payload inputs (short message)', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Vraj',
        email: 'vraj@gmail.com',
        subject: 'Test subject',
        message: 'short', // Zod requires min 10
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Input validation failed');
  });

  it('should successfully catalog a valid contact message', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Vraj Patel',
        email: 'patelvrajpatel30@gmail.com',
        subject: 'Full-stack Position',
        message: 'This is a long enough message for contact validation.',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});

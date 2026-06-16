import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/ai/gemini', () => ({
  askVrajAI: vi.fn().mockResolvedValue('Vraj Patel is a software engineer.'),
  askVrajAIStream: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  isSupabaseConfigured: false,
  createServerSupabaseClient: vi.fn(),
}));

describe('Ask Route API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject invalid empty prompt asks', async () => {
    const request = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        prompt: '',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid payload values');
  });

  it('should successfully answer query asks via static fallback response', async () => {
    const request = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Who is Vraj?',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.response).toBe('Vraj Patel is a software engineer.');
  });
});

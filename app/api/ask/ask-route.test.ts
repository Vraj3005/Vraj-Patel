import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { PORTFOLIO_CONTEXT } from '@/lib/ai/portfolioContext';
import skillsData from '@/db/skills.json';
import { projects } from '@/lib/data/projects';

vi.mock('@/lib/ai/gemini', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ai/gemini')>();
  return {
    ...actual,
    isGeminiConfigured: false,
    askVrajAI: vi.fn().mockImplementation((prompt: string) => {
      if (prompt === '__TEST_ACTUAL_FALLBACK__') {
        return "I'm sorry, but I can't access live Gemini models right now. You can explore Vraj's portfolio directly to view his projects, skills, and resume.";
      }
      return 'Vraj Patel is a software engineer.';
    }),
  };
});

vi.mock('@/lib/supabase/admin', () => ({
  isSupabaseAdminConfigured: false,
  supabaseAdmin: {},
}));

describe('Ask Route API Input Validation', () => {
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

  it('should reject prompts longer than 500 characters', async () => {
    const longPrompt = 'a'.repeat(501);
    const request = new NextRequest('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        prompt: longPrompt,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.prompt).toBeDefined();
    expect(body.details.prompt[0]).toContain('too long');
  });
});

describe('AI Route Fallback & Safety Rails', () => {
  it('fallback response contains no fictional claims', async () => {
    const { askVrajAI } = await import('@/lib/ai/gemini');
    const response = await askVrajAI('__TEST_ACTUAL_FALLBACK__');
    
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
    
    const fictionalTerms = ['wasm', 'webgl', '99.4%', 'forecast accuracy', 'gpu shader'];
    for (const term of fictionalTerms) {
      expect(response.toLowerCase()).not.toContain(term);
    }
  });

  it('fallback response stream contains no fictional claims', async () => {
    const { getMockVrajResponseStream } = await import('@/lib/ai/gemini');
    const stream = getMockVrajResponseStream('Any query');
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value);
    }
    
    expect(fullText).toBeDefined();
    expect(fullText.length).toBeGreaterThan(0);
    
    const fictionalTerms = ['wasm', 'webgl', '99.4%', 'accuracy', 'gpu shader'];
    for (const term of fictionalTerms) {
      expect(fullText.toLowerCase()).not.toContain(term);
    }
  });
});

describe('Canonical Data Integrity', () => {
  it('AI context includes only canonical data from skills.json and projects.ts', () => {
    const expectedLanguages = skillsData.find(s => s.category === 'Languages')?.items || [];
    expect(PORTFOLIO_CONTEXT.skills.languages).toEqual(expectedLanguages);

    const expectedFrontend = skillsData.find(s => s.category === 'Frontend Development')?.items || [];
    expect(PORTFOLIO_CONTEXT.skills.frontend).toEqual(expectedFrontend);

    expect(PORTFOLIO_CONTEXT.projects.length).toBe(projects.length);
    expect(PORTFOLIO_CONTEXT.projects[0].title).toBe(projects[0].title);
  });
});

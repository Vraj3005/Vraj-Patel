import { NextRequest, NextResponse } from 'next/server';
import { GithubFetcher } from '@/lib/github/github-fetcher';
import { MetricsCollector } from '@/lib/metrics/metrics-collector';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('account') || 'combined'; // 'combined' | 'personal' | 'academic'
    const result = await GithubFetcher.getContributions(mode);
    await MetricsCollector.recordApiLatency('/api/github/contributions', Date.now() - startTime);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error fetching GitHub contributions:', err);
    await MetricsCollector.recordApiLatency('/api/github/contributions', Date.now() - startTime);
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
}
